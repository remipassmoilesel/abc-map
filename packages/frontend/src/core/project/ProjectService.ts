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
import { CompressedProject, Logger, ProjectConstants, ProjectHelper } from '@abc-map/shared';
import { AbcLayout, AbcProjectManifest, AbcProjection, AbcProjectMetadata, LayerType, LayoutFormat, WmsMetadata, Zipper } from '@abc-map/shared';
import { AxiosInstance } from 'axios';
import { ProjectFactory } from './ProjectFactory';
import { GeoService } from '../geo/GeoService';
import { ProjectRoutes as Api } from '../http/ApiRoutes';
import uuid from 'uuid-random';
import { MainStore } from '../store/store';
import { Encryption } from '../utils/Encryption';
import { BlobIO } from '@abc-map/shared';
import { HttpError } from '../http/HttpError';
import { ToastService } from '../ui/ToastService';

export const logger = Logger.get('ProjectService.ts', 'info');

export class ProjectService {
  constructor(
    private jsonClient: AxiosInstance,
    private downloadClient: AxiosInstance,
    private store: MainStore,
    private toasts: ToastService,
    private geoService: GeoService
  ) {}

  public newProject(): void {
    this.geoService.getMainMap().defaultLayers();
    this.store.dispatch(ProjectActions.newProject(ProjectFactory.newProjectMetadata()));
    logger.info('New project created');
  }

  public getCurrentMetadata(): AbcProjectMetadata {
    return this.store.getState().project.metadata;
  }

  public list(): Promise<AbcProjectMetadata[]> {
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

  public async exportCurrentProject(password?: string): Promise<CompressedProject<Blob>> {
    const containsCredentials = this.geoService.getMainMap().containsCredentials();
    if (containsCredentials && !password) {
      throw new Error('Password is mandatory when project contains credentials');
    }

    let manifest: AbcProjectManifest = {
      metadata: {
        ...this.store.getState().project.metadata,
        containsCredentials,
      },
      layers: await this.geoService.exportLayers(this.geoService.getMainMap()),
      layouts: this.store.getState().project.layouts,
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

  public loadRemoteProject(id: string, password?: string): Promise<void> {
    return this.findById(id)
      .then((blob) => {
        if (!blob) {
          return Promise.reject(new Error('Project not found'));
        }
        return this.loadProject(blob, password);
      })
      .catch((err) => {
        this.toasts.httpError(err);
        return Promise.reject(err);
      });
  }

  public async loadProject(blob: Blob, password?: string): Promise<void> {
    const unzipped = await Zipper.forFrontend().unzip(blob);
    const manifestFile = unzipped.find((f) => f.path.endsWith(ProjectConstants.ManifestName));
    if (!manifestFile) {
      return Promise.reject(new Error('Invalid project, manifest not found'));
    }

    let manifest = JSON.parse(await BlobIO.asString(manifestFile.content));
    if (this.manifestContainsCredentials(manifest) && !password) {
      throw new Error('Password is mandatory when project contains credentials');
    }

    const map = this.geoService.getMainMap();
    if (password) {
      manifest = await Encryption.decryptManifest(manifest, password);
    }
    await this.geoService.importProject(map, manifest);
    this.store.dispatch(ProjectActions.loadProject(manifest));
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

  public addLayouts(layouts: AbcLayout[]): void {
    this.store.dispatch(ProjectActions.addLayouts(layouts));
  }

  public setLayoutIndex(layout: AbcLayout, index: number): void {
    this.store.dispatch(ProjectActions.setLayoutIndex(layout, index));
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

  // TODO: Delete this method, unziping project is a heavy process
  public async compressedContainsCredentials(blob: Blob): Promise<boolean> {
    const manifest = await ProjectHelper.forFrontend().extractManifest(blob);
    return this.manifestContainsCredentials(manifest);
  }

  public manifestContainsCredentials(project: AbcProjectManifest): boolean {
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
}
