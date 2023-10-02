/**
 * Copyright © 2023 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { ProjectActions } from '../store/project/actions';
import {
  AbcFile,
  AbcLayer,
  AbcLayout,
  AbcProjectManifest,
  AbcProjectMetadata,
  AbcProjectQuotas,
  AbcSharedView,
  AbcTextFrame,
  AbcView,
  BlobIO,
  CompressedProject,
  Logger,
  ProjectConstants,
  Zipper,
} from '@abc-map/shared';
import { AxiosInstance } from 'axios';
import { ProjectFactory } from './ProjectFactory';
import { GeoService } from '../geo/GeoService';
import { ProjectRoutes as Api } from '../http/ApiRoutes';
import { mainStore, MainStore } from '../store/store';
import { HttpError } from '../http/HttpError';
import { ToastService } from '../ui/ToastService';
import { ModalService } from '../ui/ModalService';
import { ProjectEvent, ProjectEventType } from './ProjectEvent';
import { ProjectUpdater } from './migrations/ProjectUpdater';
import { ProjectStatus } from './ProjectStatus';
import { Routes } from '../../routes';
import { TextFrameHelpers } from './TextFrameHelpers';
import uuid from 'uuid-random';
import { ProjectIDBStorage } from '../storage/indexed-db/projects/ProjectIDBStorage';
import { ApiClient, DownloadClient } from '../http/http-clients';
import { throttleDbStorage } from '../storage/indexed-db/client/throttleDbStorage';
import { LayerIDBStorage } from '../storage/indexed-db/layers/LayerIDBStorage';
import { LayoutIDBStorage } from '../storage/indexed-db/layouts/LayoutIDBStorage';
import { SharedViewIDBStorage } from '../storage/indexed-db/shared-views/SharedViewIDBStorage';
import { CURRENT_VERSION } from '../storage/indexed-db/projects/ProjectIDBEntry';
import { UiConstants } from '../ui/UiConstants';

export const logger = Logger.get('ProjectService.ts', 'warn');

// This timeout is used for download / upload of projects
const SaveProjectTimeout = 45_000;

export type ExportResult = { manifest: AbcProjectManifest; files: AbcFile<Blob>[] } | ProjectStatus.Canceled;

export class ProjectService {
  public static create(toasts: ToastService, geoService: GeoService, modals: ModalService) {
    const updater = ProjectUpdater.create(modals);
    const storage = ProjectIDBStorage.create();
    return new ProjectService(ApiClient, DownloadClient, mainStore, toasts, geoService, updater, storage);
  }

  private eventTarget = document.createDocumentFragment();
  private autoSaveSubscription?: () => void;

  constructor(
    private apiClient: AxiosInstance,
    private downloadClient: AxiosInstance,
    private store: MainStore,
    private toasts: ToastService,
    private geoService: GeoService,
    private updater: ProjectUpdater,
    private storage: ProjectIDBStorage
  ) {}

  public enableProjectAutoSave() {
    const mainMap = this.geoService.getMainMap();

    // We save project each time store change
    const persistProjectThrottled = throttleDbStorage(this.persistProjectLocally, 5_000);
    this.autoSaveSubscription = this.store.subscribe(persistProjectThrottled);
    this.persistProjectLocally();

    // We watch store for special objects of project
    LayoutIDBStorage.watch(this.store);
    SharedViewIDBStorage.watch(this.store);

    // When layers change, we enable storage for them if needed, then we call project persistence
    const persistLayers = () => {
      const layers = mainMap.getLayers();
      for (const layer of layers) {
        // Layer is a vector layer
        if (layer.isVector()) {
          const isLargeLayer = layer.getSource().getFeatures().length >= UiConstants.FEATURE_PER_LAYER_MAX;

          // We enable storage for "small layers"
          if (!LayerIDBStorage.isStorageEnabled(layer) && !isLargeLayer) {
            logger.debug(`Enabling storage on layer ${layer.getName()} (vector=${layer.isVector()})`);
            LayerIDBStorage.enableVectorLayerStorage(layer);
          }
          // We disable storage for "large layers"
          else if (LayerIDBStorage.isStorageEnabled(layer) && isLargeLayer) {
            logger.debug(`Disabling storage on layer ${layer.getName()} (vector=${layer.isVector()})`);
            LayerIDBStorage.disableVectorLayerStorage(layer);
          }
        }
        // Layer is a tile layer
        else {
          LayerIDBStorage.enableTileLayerStorage(layer);
        }
      }

      persistProjectThrottled();
    };

    persistLayers();
    mainMap.addLayerChangeListener(persistLayers);
  }

  public disableProjectAutoSave() {
    this.autoSaveSubscription && this.autoSaveSubscription();

    LayoutIDBStorage.unwatch();
    SharedViewIDBStorage.unwatch();
  }

  private persistProjectLocally = () => {
    logger.debug('Saving project ...');
    const start = Date.now();
    const { mainView, metadata, sharedViews, layouts } = this.store.getState().project;

    const layerIds = this.geoService
      .getMainMap()
      .getLayers()
      .map((layer) => layer.getId())
      .filter((layerId): layerId is string => !!layerId);

    const sharedViewIds = sharedViews.list.map((view) => view.id);
    const layoutIds = layouts.list.map((layout) => layout.id);

    this.storage
      .put({
        version: CURRENT_VERSION,
        metadata,
        view: mainView,
        layerIds,
        layouts: {
          layoutIds,
          abcMapAttributionsEnabled: layouts.abcMapAttributionsEnabled,
        },
        sharedViews: {
          fullscreen: sharedViews.fullscreen,
          mapDimensions: sharedViews.mapDimensions,
          viewIds: sharedViewIds,
        },
      })
      .catch((err) => logger.error('Project storage error: ', err))
      .finally(() => logger.debug('Saved project in ' + (Date.now() - start) + 'ms'));
  };

  public addProjectLoadedListener(listener: (ev: ProjectEvent) => void) {
    this.eventTarget.addEventListener(ProjectEventType.ProjectLoaded, listener);
  }

  public removeProjectLoadedListener(listener: (ev: ProjectEvent) => void) {
    this.eventTarget.removeEventListener(ProjectEventType.ProjectLoaded, listener);
  }

  public async newProject(): Promise<void> {
    // Create new manifest
    const manifest = ProjectFactory.newProjectManifest();
    await this.loadExtracted(manifest, []);

    // Reset main map layers
    this.geoService.getMainMap().setDefaultLayers();

    logger.info('New project created');
  }

  /**
   * Download then load project.
   * @param id
   */
  public loadRemotePrivateProject(id: string): Promise<void> {
    return this.findRemoteById(id).then((blob) => {
      if (!blob) {
        return Promise.reject(new Error('Project not found'));
      }
      return this.loadBlobProject(blob);
    });
  }

  /**
   * Download then load project.
   *
   * @param id
   */
  public loadRemotePublicProject(id: string): Promise<void> {
    return this.findRemotePublicById(id).then((blob) => {
      if (!blob) {
        return Promise.reject(new Error('Project not found'));
      }
      return this.loadBlobProject(blob);
    });
  }

  public async isStoredLocally(projectId: string): Promise<boolean> {
    return this.storage.exists(projectId);
  }

  /**
   * Load a project stored in IndexedDB.
   *
   * @param id
   */
  public async loadLocalProject(id: string): Promise<void> {
    const project = await this.storage.getManifest(id);
    if (!project) {
      throw new Error(`Not found: ${id}`);
    }

    return this.loadExtracted(project, []);
  }

  /**
   * Load a zipped project.
   *
   * @param blob
   */
  public async loadBlobProject(blob: Blob): Promise<void> {
    // Unzip project
    const files = await Zipper.forBrowser().unzip(blob);
    const manifestFile = files.find((f) => f.path.endsWith(ProjectConstants.ManifestName));
    if (!manifestFile) {
      return Promise.reject(new Error('Invalid project, manifest not found'));
    }

    // Parse manifest
    const manifest: AbcProjectManifest = JSON.parse(await BlobIO.asString(manifestFile.content));
    return this.loadExtracted(manifest, files);
  }

  private async loadExtracted(_manifest: AbcProjectManifest, _files: AbcFile<Blob>[]): Promise<void> {
    // Migrate project if necessary
    const migrated = await this.updater.update(_manifest, _files);
    let manifest = migrated.manifest;
    const files = migrated.files;

    // Load view and layers projection
    // FIXME: we should batch projection loading here
    await this.geoService.loadProjection(manifest.view.projection.name);
    for (const lay of manifest.layers) {
      const projectionName = 'projection' in lay.metadata && lay.metadata.projection?.name;
      if (projectionName) {
        await this.geoService.loadProjection(projectionName);
      }
    }

    // We load frame images
    manifest = {
      ...manifest,
      layouts: {
        list: TextFrameHelpers.loadImagesOfLayouts(manifest.layouts.list, files),
        abcMapAttributionsEnabled: manifest.layouts.abcMapAttributionsEnabled,
      },
      sharedViews: {
        ...manifest.sharedViews,
        list: TextFrameHelpers.loadImagesOfSharedViews(manifest.sharedViews.list, files),
      },
    };

    // Load project manifest and layers
    this.store.dispatch(ProjectActions.loadProject(manifest));
    const layerDefs = manifest.layers.map((layer) => ({ ...layer, metadata: { ...layer.metadata, active: false } } as AbcLayer));
    await this.geoService.importLayers(layerDefs);

    // Set active layer if any
    const map = this.geoService.getMainMap();
    const layers = map.getLayers();
    if (layers.length) {
      map.setActiveLayer(layers.slice(-1)[0]);
    }

    // Set active layout if any
    if (manifest.layouts.list.length) {
      this.store.dispatch(ProjectActions.setActiveLayout(manifest.layouts.list[0].id));
    }

    // Set active shared view
    if (manifest.sharedViews.list.length) {
      this.store.dispatch(ProjectActions.setActiveSharedView(manifest.sharedViews.list[0].id));
    }

    // Set view
    this.store.dispatch(ProjectActions.setView(manifest.view));
    this.geoService.getMainMap().setView(manifest.view);

    this.eventTarget.dispatchEvent(new ProjectEvent(ProjectEventType.ProjectLoaded));
    logger.info('Project loaded');
  }

  public async exportCurrentProject(): Promise<ExportResult> {
    const state = this.store.getState().project;

    const [imagesFromLayouts, layouts] = await TextFrameHelpers.extractImagesFromLayouts(state.layouts.list);
    const [imagesFromViews, sharedViews] = await TextFrameHelpers.extractImagesFromSharedViews(state.sharedViews.list);

    const manifest: AbcProjectManifest = {
      metadata: state.metadata,
      layers: await this.geoService.exportLayers(this.geoService.getMainMap()),
      view: state.mainView,
      layouts: {
        list: layouts,
        abcMapAttributionsEnabled: state.layouts.abcMapAttributionsEnabled,
      },
      sharedViews: {
        list: sharedViews,
        fullscreen: state.sharedViews.fullscreen,
        mapDimensions: state.sharedViews.mapDimensions,
      },
    };

    return { manifest, files: imagesFromLayouts.concat(imagesFromViews) };
  }

  public async exportAndZipCurrentProject(): Promise<CompressedProject<Blob> | ProjectStatus.Canceled> {
    const exported = await this.exportCurrentProject();
    if (exported === ProjectStatus.Canceled) {
      return exported;
    }

    const files: AbcFile<Blob>[] = [
      {
        path: ProjectConstants.ManifestName,
        content: new Blob([JSON.stringify(exported.manifest)]),
      },
      ...exported.files,
    ];
    const compressed = await Zipper.forBrowser().zipFiles(files);
    return { project: compressed, metadata: exported.manifest.metadata };
  }

  /**
   * Export and return a compressed project that can be imported in another session.
   *
   * For this purpose, some ids are modified, but not all.
   */
  public async cloneCurrent(): Promise<CompressedProject<Blob> | ProjectStatus.Canceled> {
    const exported = await this.exportCurrentProject();
    if (exported === ProjectStatus.Canceled) {
      return exported;
    }

    const cloned: AbcProjectManifest = {
      ...exported.manifest,
      metadata: {
        ...exported.manifest.metadata,
        id: uuid(),
      },
      layers: exported.manifest.layers.map((lay) => ({ ...lay, metadata: { ...lay.metadata, id: uuid() } })) as AbcLayer[], // Typings are borked
      layouts: {
        list: exported.manifest.layouts.list.map((lay) => ({ ...lay, id: uuid() })),
        abcMapAttributionsEnabled: exported.manifest.layouts.abcMapAttributionsEnabled,
      },
      sharedViews: {
        ...exported.manifest.sharedViews,
        list: exported.manifest.sharedViews.list.map((view) => ({ ...view, id: uuid() })),
      },
    };

    const files: AbcFile<Blob>[] = [
      {
        path: ProjectConstants.ManifestName,
        content: new Blob([JSON.stringify(cloned)]),
      },
      ...exported.files,
    ];
    const compressed = await Zipper.forBrowser().zipFiles(files);
    return { project: compressed, metadata: cloned.metadata };
  }

  public async saveCurrent(): Promise<ProjectStatus> {
    const compressed = await this.exportAndZipCurrentProject();
    if (ProjectStatus.Canceled === compressed) {
      return ProjectStatus.Canceled;
    }

    if (compressed.project.size >= ProjectConstants.MaxSizeBytes) {
      return ProjectStatus.TooHeavy;
    }

    const formData = new FormData();
    formData.append('metadata', JSON.stringify(compressed.metadata));
    formData.append('project', compressed.project);
    return this.apiClient
      .post(Api.saveProject(), formData, {
        timeout: SaveProjectTimeout,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then<ProjectStatus.Ok>(() => ProjectStatus.Ok)
      .catch((err) => {
        if (HttpError.isTooManyProject(err)) {
          return ProjectStatus.OnlineQuotaExceeded;
        }
        return Promise.reject(err);
      });
  }

  public setPublic(shared: boolean): void {
    this.store.dispatch(ProjectActions.setPublic(shared));
  }

  public getLayouts(): AbcLayout[] {
    return this.store.getState().project.layouts.list;
  }

  public getTextFrames(): AbcTextFrame[] {
    const project = this.store.getState().project;
    return project.layouts.list.flatMap((lay) => lay.textFrames).concat(project.sharedViews.list.flatMap((view) => view.textFrames));
  }

  public addLayouts(layouts: AbcLayout[]): void {
    this.store.dispatch(ProjectActions.addLayouts(layouts));
  }

  public addLayout(layout: AbcLayout, index?: number): void {
    this.store.dispatch(ProjectActions.addLayout(layout, index));
  }

  public setActiveLayout(id: string | undefined) {
    this.store.dispatch(ProjectActions.setActiveLayout(id));
  }

  public getActiveLayout(): AbcLayout | undefined {
    const state = this.store.getState().project;
    const id = state.layouts.activeId;
    if (!id) {
      return;
    }

    return state.layouts.list.find((lay) => lay.id === id);
  }

  public setLayoutIndex(layout: AbcLayout, index: number): void {
    this.store.dispatch(ProjectActions.setLayoutIndex(layout, index));
  }

  public updateTextFrame(frame: AbcTextFrame): void {
    this.store.dispatch(ProjectActions.updateTextFrame(frame));
  }

  public updateLayout(layout: AbcLayout) {
    if (!layout.id) {
      throw new Error(`Cannot update layout without id: ${JSON.stringify(layout)}`);
    }
    this.store.dispatch(ProjectActions.updateLayout(layout));
  }

  public clearLayouts(): void {
    this.store.dispatch(ProjectActions.clearLayouts());
  }

  public removeLayout(id: string): void {
    this.store.dispatch(ProjectActions.removeLayouts([id]));
  }

  public removeLayouts(ids: string[]): void {
    this.store.dispatch(ProjectActions.removeLayouts(ids));
  }

  public renameProject(name: string) {
    this.store.dispatch(ProjectActions.setProjectName(name));
  }

  public addSharedViews(views: AbcSharedView[]): void {
    this.store.dispatch(ProjectActions.addSharedViews(views));
  }

  public addSharedView(view: AbcSharedView, index: number): void {
    this.store.dispatch(ProjectActions.addSharedView(view, index));
  }

  public getSharedViews(): AbcSharedView[] {
    return this.store.getState().project.sharedViews.list;
  }

  public getActiveSharedView(): AbcSharedView | undefined {
    const state = this.store.getState().project.sharedViews;
    if (!state.activeId) {
      return;
    }

    return state.list.find((v) => v.id === state.activeId);
  }

  public setActiveSharedView(id: string): void {
    this.store.dispatch(ProjectActions.setActiveSharedView(id));
  }

  public updateSharedView(view: AbcSharedView): void {
    this.store.dispatch(ProjectActions.updateSharedView(view));
  }

  public removeSharedViews(views: AbcSharedView[]): void {
    this.store.dispatch(ProjectActions.removeSharedViews(views));

    const remainingViews = this.store.getState().project.sharedViews;
    if (remainingViews.list.length) {
      this.store.dispatch(ProjectActions.setActiveSharedView(remainingViews.list[0].id));
    }
  }

  public setSharedMapDimensions(width: number, height: number): void {
    this.store.dispatch(ProjectActions.setSharedMapDimensions(width, height));
  }

  public toggleSharedMapFullScreen(): void {
    const fullscreen = this.store.getState().project.sharedViews.fullscreen;
    this.store.dispatch(ProjectActions.setSharedMapFullscreen(!fullscreen));
  }

  public setView(view: AbcView): void {
    this.store.dispatch(ProjectActions.setView(view));
  }

  public getPublicLink(_projectId?: string): string {
    const projectId = _projectId ?? this.store.getState().project.metadata.id;
    if (!projectId) {
      throw new Error('Invalid project id: ' + projectId);
    }
    return `${window.location.protocol}//${window.location.host}${Routes.sharedMap().withParams({ projectId })}`;
  }

  public listRemoteProjects(): Promise<AbcProjectMetadata[]> {
    return this.apiClient
      .get(Api.listProject())
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }

  public findRemoteById(id: string): Promise<Blob | undefined> {
    return this.downloadClient.get(Api.findById(id)).then((res) => res.data);
  }

  public findRemotePublicById(id: string): Promise<Blob | undefined> {
    return this.downloadClient.get(Api.findSharedById(id)).then((res) => res.data);
  }

  public deleteById(id: string): Promise<void> {
    return this.apiClient.delete(Api.findById(id)).then(() => undefined);
  }

  public getQuotas(): Promise<AbcProjectQuotas> {
    return this.apiClient.get(Api.quotas()).then((res) => res.data);
  }
}
