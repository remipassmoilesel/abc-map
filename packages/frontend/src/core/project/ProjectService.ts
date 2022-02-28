/**
 * Copyright © 2021 Rémi Pace.
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
  AbcLayout,
  AbcLegend,
  AbcLegendItem,
  AbcProjectManifest,
  AbcProjectMetadata,
  AbcSharedView,
  AbcView,
  BlobIO,
  CompressedProject,
  LayerType,
  LegendDisplay,
  Logger,
  ProjectConstants,
  Zipper,
} from '@abc-map/shared';
import { AxiosInstance } from 'axios';
import { ProjectFactory } from './ProjectFactory';
import { GeoService } from '../geo/GeoService';
import { ProjectRoutes as Api } from '../http/ApiRoutes';
import { MainStore } from '../store/store';
import { Encryption } from '../utils/Encryption';
import { HttpError } from '../http/HttpError';
import { ToastService } from '../ui/ToastService';
import { ModalStatus } from '../ui/typings';
import { ModalService } from '../ui/ModalService';
import { ProjectEvent, ProjectEventType } from './ProjectEvent';
import { Errors } from '../utils/Errors';
import { ProjectUpdater } from './ProjectUpdater';
import cloneDeep from 'lodash/cloneDeep';
import { ProjectStatus } from './ProjectStatus';
import { Routes } from '../../routes';

export const logger = Logger.get('ProjectService.ts');

// This timeout is used for download / upload of projects
const LongTimeout = 45_000;

export class ProjectService {
  public static create(
    jsonClient: AxiosInstance,
    downloadClient: AxiosInstance,
    store: MainStore,
    toasts: ToastService,
    geoService: GeoService,
    modals: ModalService
  ) {
    const updater = ProjectUpdater.create(modals);
    return new ProjectService(jsonClient, downloadClient, store, toasts, geoService, modals, updater);
  }

  private eventTarget = document.createDocumentFragment();

  constructor(
    private jsonClient: AxiosInstance,
    private downloadClient: AxiosInstance,
    private store: MainStore,
    private toasts: ToastService,
    private geoService: GeoService,
    private modals: ModalService,
    private updater: ProjectUpdater
  ) {}

  public addProjectLoadedListener(listener: (ev: ProjectEvent) => void) {
    this.eventTarget.addEventListener(ProjectEventType.ProjectLoaded, listener);
  }

  public removeProjectLoadedListener(listener: (ev: ProjectEvent) => void) {
    this.eventTarget.removeEventListener(ProjectEventType.ProjectLoaded, listener);
  }

  public async newProject(): Promise<void> {
    // Create new manifest
    const manifest = ProjectFactory.newProjectManifest();
    await this.loadExtracted(manifest, undefined);

    // Reset main map layers
    this.geoService.getMainMap().setDefaultLayers();

    logger.info('New project created');
  }

  public loadPrivateProject(id: string, password?: string): Promise<void> {
    return this.findById(id).then((blob) => {
      if (!blob) {
        return Promise.reject(new Error('Project not found'));
      }
      return this.loadBlobProject(blob, password);
    });
  }

  public loadSharedProject(id: string): Promise<void> {
    return this.findSharedById(id).then((blob) => {
      if (!blob) {
        return Promise.reject(new Error('Project not found'));
      }
      return this.loadBlobProject(blob);
    });
  }

  /**
   * Load a zipped project.
   *
   * If password is missing and project is encrypted, password will be prompted.
   *
   * We must prompt here to prevent several unzip of project, which is an expensive operation.
   *
   * @param blob
   * @param password
   */
  public async loadBlobProject(blob: Blob, password?: string): Promise<void> {
    // Unzip project
    const unzipped = await Zipper.forFrontend().unzip(blob);
    const manifestFile = unzipped.find((f) => f.path.endsWith(ProjectConstants.ManifestName));
    if (!manifestFile) {
      return Promise.reject(new Error('Invalid project, manifest not found'));
    }

    // Parse manifest
    const manifest: AbcProjectManifest = JSON.parse(await BlobIO.asString(manifestFile.content));
    return this.loadExtracted(manifest, password);
  }

  private async loadExtracted(_manifest: AbcProjectManifest, _password: string | undefined, _files: AbcFile[] = []): Promise<void> {
    // Migrate project if necessary
    let { manifest } = await this.updater.update(_manifest, _files);

    // Prompt password if necessary
    let password = _password;
    if (Encryption.manifestContainsCredentials(manifest) && !password) {
      const witness = Encryption.extractEncryptedData(manifest);
      const ev = await this.modals.getProjectPassword(witness || '');
      const canceled = ev.status === ModalStatus.Canceled;
      password = ev.value;
      if (canceled || !password) {
        Errors.missingPassword();
      }
    }

    // Decrypt project manifest if password set
    if (password) {
      manifest = await Encryption.decryptManifest(manifest, password);
    }

    // Load view and layers projection
    await this.geoService.loadProjection(manifest.view.projection.name);
    for (const lay of manifest.layers) {
      if (LayerType.Wms === lay.type && lay.metadata.projection) {
        await this.geoService.loadProjection(lay.metadata.projection.name);
      } else if (LayerType.Xyz === lay.type && lay.metadata.projection) {
        await this.geoService.loadProjection(lay.metadata.projection.name);
      }
    }

    // Load project
    this.store.dispatch(ProjectActions.loadProject(manifest));
    await this.geoService.importLayers(manifest.layers);

    // Set active layout if any
    if (manifest.layouts.length) {
      this.store.dispatch(ProjectActions.setActiveLayout(manifest.layouts[0].id));
    }

    // Set active shared view
    if (manifest.sharedViews.length) {
      this.store.dispatch(ProjectActions.setActiveSharedView(manifest.sharedViews[0].id));
    }

    // Set view
    this.store.dispatch(ProjectActions.setView(manifest.view));
    this.geoService.getMainMap().setView(manifest.view);

    this.eventTarget.dispatchEvent(new ProjectEvent(ProjectEventType.ProjectLoaded));
    logger.info('Project loaded');
  }

  public async exportCurrentProject(): Promise<CompressedProject<Blob> | ProjectStatus.Canceled> {
    const state = this.store.getState().project;
    const containsCredentials = Encryption.mapContainsCredentials(this.geoService.getMainMap());
    const shouldBeEncrypted = containsCredentials && !state.metadata.public;

    let password: string | undefined;
    if (shouldBeEncrypted) {
      const event = await this.modals.setProjectPassword();
      if (event.status === ModalStatus.Canceled) {
        return ProjectStatus.Canceled;
      }
      password = event.value;
    }

    let manifest: AbcProjectManifest = {
      metadata: cloneDeep(state.metadata),
      layers: await this.geoService.exportLayers(this.geoService.getMainMap()),
      view: cloneDeep(state.mainView),
      layouts: cloneDeep(state.layouts.list),
      sharedViews: cloneDeep(state.sharedViews.list),
    };

    if (shouldBeEncrypted && password) {
      manifest = await Encryption.encryptManifest(manifest, password);
    }

    const project = await Zipper.forFrontend().zipFiles([{ path: ProjectConstants.ManifestName, content: new Blob([JSON.stringify(manifest)]) }]);
    return { project, metadata: manifest.metadata };
  }

  public async saveCurrent(): Promise<ProjectStatus> {
    const compressed = await this.exportCurrentProject();
    if (ProjectStatus.Canceled === compressed) {
      return ProjectStatus.Canceled;
    }

    if (compressed.project.size >= ProjectConstants.MaxSizeBytes) {
      return ProjectStatus.TooHeavy;
    }

    const formData = new FormData();
    formData.append('metadata', JSON.stringify(compressed.metadata));
    formData.append('project', compressed.project);
    return this.jsonClient
      .post(Api.saveProject(), formData, {
        timeout: LongTimeout,
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

  public addLayouts(layouts: AbcLayout[]): void {
    this.store.dispatch(ProjectActions.addLayouts(layouts));
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

  public addLegendItems(legendId: string, items: AbcLegendItem[]): void {
    this.store.dispatch(ProjectActions.addLegendItems(legendId, items));
  }

  public updateLegend(legend: AbcLegend): void {
    this.store.dispatch(ProjectActions.updateLegend(legend));
  }

  public updateLegendItem(legendId: string, item: AbcLegendItem): void {
    this.store.dispatch(ProjectActions.updateLegendItem(legendId, item));
  }

  public setLegendSize(legendId: string, width: number, height: number) {
    this.store.dispatch(ProjectActions.setLegendSize(legendId, width, height));
  }

  public setLegendDisplay(legendId: string, display: LegendDisplay) {
    this.store.dispatch(ProjectActions.setLegendDisplay(legendId, display));
  }

  public deleteLegendItem(legendId: string, item: AbcLegendItem) {
    this.store.dispatch(ProjectActions.deleteLegendItem(legendId, item));
  }

  public setLegendItemIndex(legendId: string, item: AbcLegendItem, newIndex: number) {
    this.store.dispatch(ProjectActions.setLegendItemIndex(legendId, item, newIndex));
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

  public setView(view: AbcView): void {
    this.store.dispatch(ProjectActions.setView(view));
  }

  public getPublicLink(): string {
    const projectId = this.store.getState().project.metadata.id;
    return `${window.location.protocol}//${window.location.host}${Routes.sharedMap().withParams({ projectId })}`;
  }

  public listRemoteProjects(): Promise<AbcProjectMetadata[]> {
    return this.jsonClient
      .get(Api.listProject())
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }

  public findById(id: string): Promise<Blob | undefined> {
    return this.downloadClient.get(Api.findById(id), { timeout: LongTimeout }).then((res) => res.data);
  }

  public findSharedById(id: string): Promise<Blob | undefined> {
    return this.downloadClient.get(Api.findSharedById(id), { timeout: LongTimeout }).then((res) => res.data);
  }

  public deleteById(id: string): Promise<void> {
    return this.jsonClient.delete(Api.findById(id)).then(() => undefined);
  }
}
