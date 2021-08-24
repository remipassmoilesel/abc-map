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
  AbcProjection,
  AbcProjectManifest,
  AbcProjectMetadata,
  BlobIO,
  CompressedProject,
  LayerType,
  LayoutFormat,
  LegendDisplay,
  Logger,
  ProjectConstants,
  WmsMetadata,
  Zipper,
} from '@abc-map/shared';
import { AxiosInstance } from 'axios';
import { ProjectFactory } from './ProjectFactory';
import { GeoService } from '../geo/GeoService';
import { ProjectRoutes as Api } from '../http/ApiRoutes';
import uuid from 'uuid-random';
import { MainStore } from '../store/store';
import { Encryption } from '../utils/Encryption';
import { HttpError } from '../http/HttpError';
import { ToastService } from '../ui/ToastService';
import { ModalStatus } from '../ui/typings';
import { ModalService } from '../ui/ModalService';
import { ProjectEvent, ProjectEventType } from './ProjectEvent';
import { Errors } from '../utils/Errors';
import { ProjectUpdater } from './migrations/ProjectUpdater';

export const logger = Logger.get('ProjectService.ts', 'info');

export class ProjectService {
  private eventTarget = document.createDocumentFragment();

  constructor(
    private jsonClient: AxiosInstance,
    private downloadClient: AxiosInstance,
    private store: MainStore,
    private toasts: ToastService,
    private geoService: GeoService,
    private modals: ModalService,
    private updater = ProjectUpdater.create()
  ) {}

  public addEventListener(listener: (ev: ProjectEvent) => void) {
    this.eventTarget.addEventListener(ProjectEventType.ProjectLoaded, listener);
  }

  public removeEventListener(listener: (ev: ProjectEvent) => void) {
    this.eventTarget.removeEventListener(ProjectEventType.ProjectLoaded, listener);
  }

  public async newProject(): Promise<void> {
    // Create new manifest
    const manifest = ProjectFactory.newProjectManifest();
    await this.loadManifest(manifest, undefined);

    // Reset main map layers
    this.geoService.getMainMap().setDefaultLayers();

    logger.info('New project created');
  }

  public loadRemoteProject(id: string, password?: string): Promise<void> {
    return this.findById(id)
      .then((blob) => {
        if (!blob) {
          return Promise.reject(new Error('Project not found'));
        }
        return this.loadBlobProject(blob, password);
      })
      .catch((err) => {
        this.toasts.httpError(err);
        return Promise.reject(err);
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
    return this.loadManifest(manifest, password);
  }

  public async loadManifest(manifest: AbcProjectManifest, password: string | undefined, files: AbcFile[] = []): Promise<void> {
    // Prompt password if necessary
    let _password = password;
    if (this.manifestContainsCredentials(manifest) && !_password) {
      const ev = await this.modals.getProjectPassword();
      const canceled = ev.status === ModalStatus.Canceled;
      _password = ev.value;
      if (canceled || !_password) {
        Errors.missingPassword();
      }
    }

    // Decrypt project manifest if password set
    if (_password) {
      manifest = await Encryption.decryptManifest(manifest, _password);
    }

    // Migrate project if necessary
    const migrated = await this.updater.update(manifest, files);

    // Load project
    this.store.dispatch(ProjectActions.loadProject(migrated.manifest));
    await this.geoService.importLayers(migrated.manifest.layers);

    // Set view
    this.store.dispatch(ProjectActions.viewChanged(migrated.manifest.view));
    this.geoService.getMainMap().setView(migrated.manifest.view);

    this.eventTarget.dispatchEvent(new ProjectEvent(ProjectEventType.ProjectLoaded));
    logger.info('Project loaded');
  }

  public async exportCurrentProject(password?: string): Promise<CompressedProject<Blob>> {
    const containsCredentials = this.geoService.getMainMap().containsCredentials();
    if (containsCredentials && !password) {
      throw new Error('Password is mandatory when project contains credentials');
    }

    let manifest: AbcProjectManifest = {
      metadata: this.store.getState().project.metadata,
      layers: await this.geoService.exportLayers(),
      layouts: this.store.getState().project.layouts,
      legend: this.store.getState().project.legend,
      view: this.store.getState().project.view,
    };

    if (containsCredentials && password) {
      manifest = await Encryption.encryptManifest(manifest, password);
    }

    const project = await Zipper.forFrontend().zipFiles([{ path: ProjectConstants.ManifestName, content: new Blob([JSON.stringify(manifest)]) }]);
    return { project, metadata: manifest.metadata };
  }

  public save(project: CompressedProject<Blob>): Promise<void> {
    if (project.project.size >= ProjectConstants.MaxSizeBytes) {
      throw new Error('Project is too heavy');
    }

    const formData = new FormData();
    formData.append('metadata', JSON.stringify(project.metadata));
    formData.append('project', project.project);
    return this.jsonClient
      .post(Api.saveProject(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => undefined)
      .catch((err) => {
        if (HttpError.isTooManyProject(err)) {
          this.toasts.error('Désolé 😞 vous avez atteint votre quota de projet enregistré. Supprimez-en un.');
        } else {
          this.toasts.httpError(err);
        }

        return Promise.reject(err);
      });
  }

  public newLayout(name: string, format: LayoutFormat, center: number[], resolution: number, projection: AbcProjection): AbcLayout {
    const layout: AbcLayout = {
      id: uuid(),
      name,
      format,
      view: {
        center,
        resolution,
        projection,
      },
    };
    this.addLayouts([layout]);
    return layout;
  }

  public getLayouts(): AbcLayout[] {
    return this.store.getState().project.layouts;
  }

  public getLegend(): AbcLegend {
    return this.store.getState().project.legend;
  }

  public addLayouts(layouts: AbcLayout[]): void {
    this.store.dispatch(ProjectActions.addLayouts(layouts));
  }

  public setLayoutIndex(layout: AbcLayout, index: number): void {
    this.store.dispatch(ProjectActions.setLayoutIndex(layout, index));
  }

  public addLegendItems(items: AbcLegendItem[]): void {
    this.store.dispatch(ProjectActions.addItems(items));
  }

  public updateLegendItem(item: AbcLegendItem): void {
    this.store.dispatch(ProjectActions.updateItem(item));
  }

  public setLegendSize(width: number, height: number) {
    this.store.dispatch(ProjectActions.setLegendSize(width, height));
  }

  public setLegendDisplay(display: LegendDisplay) {
    this.store.dispatch(ProjectActions.setLegendDisplay(display));
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
    this.store.dispatch(ProjectActions.renameProject(name));
  }

  private manifestContainsCredentials(project: AbcProjectManifest): boolean {
    // XYZ layers may contains credentials in URL
    const xyzLayers = project.layers.find((lay) => LayerType.Xyz === lay.type);
    if (xyzLayers) {
      return true;
    }

    // Search for a wms layer with credentials
    const wmsLayersWithCredentials = project.layers
      .filter((lay) => LayerType.Wms === lay.type)
      .find((lay) => {
        const metadata: WmsMetadata = lay.metadata as WmsMetadata;
        return metadata.auth?.username && metadata.auth?.password;
      });

    return !!wmsLayersWithCredentials;
  }

  public deleteLegendItem(item: AbcLegendItem) {
    this.store.dispatch(ProjectActions.deleteLegendItem(item));
  }

  public setLegendItemIndex(item: AbcLegendItem, newIndex: number) {
    this.store.dispatch(ProjectActions.setLegendItemIndex(item, newIndex));
  }

  public listRemoteProjects(): Promise<AbcProjectMetadata[]> {
    return this.jsonClient
      .get(Api.listProject())
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.httpError(err);
        return Promise.reject(err);
      });
  }

  public findById(id: string): Promise<Blob | undefined> {
    return this.downloadClient
      .get(Api.findById(id))
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.httpError(err);
        return Promise.reject(err);
      });
  }

  public deleteById(id: string): Promise<void> {
    return this.jsonClient
      .delete(Api.findById(id))
      .then(() => undefined)
      .catch((err) => {
        this.toasts.httpError(err);
        return Promise.reject(err);
      });
  }
}
