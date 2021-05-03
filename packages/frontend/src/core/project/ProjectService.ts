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
import { BlobIO, Logger, ProjectHelper } from '@abc-map/frontend-commons';
import { AbcLayout, AbcProject, AbcProjection, AbcProjectMetadata, LayerType, LayoutFormat, ManifestName, WmsMetadata } from '@abc-map/shared-entities';
import { AxiosInstance } from 'axios';
import { ProjectFactory } from './ProjectFactory';
import { GeoService } from '../geo/GeoService';
import { ProjectRoutes as Api } from '../http/ApiRoutes';
import uuid from 'uuid-random';
import { MainStore } from '../store/store';
import { Encryption } from '../utils/Encryption';
import { Zipper } from '@abc-map/frontend-commons';
import { CompressedProject } from './CompressedProject';

export const logger = Logger.get('ProjectService.ts', 'info');

export class ProjectService {
  constructor(private jsonClient: AxiosInstance, private downloadClient: AxiosInstance, private store: MainStore, private geoService: GeoService) {}

  public newProject(): void {
    this.geoService.getMainMap().defaultLayers();
    this.store.dispatch(ProjectActions.newProject(ProjectFactory.newProjectMetadata()));
    logger.info('New project created');
  }

  public getCurrentMetadata(): AbcProjectMetadata {
    return this.store.getState().project.metadata;
  }

  public list(): Promise<AbcProjectMetadata[]> {
    return this.jsonClient.get(Api.listProject()).then((res) => res.data);
  }

  public findById(id: string): Promise<Blob | undefined> {
    return this.downloadClient.get(Api.findById(id)).then((res) => res.data);
  }

  public deleteById(id: string): Promise<void> {
    return this.jsonClient.delete(Api.findById(id)).then(() => undefined);
  }

  public async exportCurrentProject(password?: string): Promise<CompressedProject> {
    const containsCredentials = this.geoService.getMainMap().containsCredentials();
    if (containsCredentials && !password) {
      throw new Error('Password is mandatory when project contains credentials');
    }

    const manifest: AbcProject = {
      metadata: {
        ...this.store.getState().project.metadata,
        containsCredentials,
      },
      layers: await this.geoService.exportLayers(this.geoService.getMainMap()),
      layouts: this.store.getState().project.layouts,
    };

    if (containsCredentials && password) {
      for (const layer of manifest.layers) {
        if (LayerType.Wms === layer.type) {
          layer.metadata = await Encryption.encryptWmsMetadata(layer.metadata, password);
        }
      }
    }

    const project = await Zipper.zipFiles([{ path: ManifestName, content: new Blob([JSON.stringify(manifest)]) }]);
    return { project, metadata: manifest.metadata };
  }

  // TODO: we should check project size before save()
  public save(project: CompressedProject): Promise<void> {
    const formData = new FormData();
    formData.append('metadata', JSON.stringify(project.metadata));
    formData.append('project', project.project as Blob);
    return this.jsonClient
      .post(Api.saveProject(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => undefined);
  }

  public loadRemoteProject(id: string, password?: string): Promise<void> {
    return this.findById(id).then((blob) => {
      if (!blob) {
        return Promise.reject(new Error('Project not found'));
      }
      return this.loadProject(blob, password);
    });
  }

  public async loadProject(blob: Blob, password?: string): Promise<void> {
    const unzipped = await Zipper.unzip(blob);
    const manifestFile = unzipped.find((f) => f.path.endsWith(ManifestName));
    if (!manifestFile) {
      return Promise.reject(new Error('Invalid project'));
    }

    const project = JSON.parse(await BlobIO.asString(manifestFile.content));
    if (this.manifestContainsCredentials(project) && !password) {
      throw new Error('Password is mandatory when project contains credentials');
    }

    const map = this.geoService.getMainMap();
    let _project = project;
    if (password) {
      _project = await Encryption.decryptProject(project, password);
    }
    await this.geoService.importProject(map, _project);
    this.store.dispatch(ProjectActions.loadProject(_project));
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

  public async compressedContainsCredentials(blob: Blob): Promise<boolean> {
    const manifest = await ProjectHelper.extractManifest(blob);
    return this.manifestContainsCredentials(manifest);
  }

  public manifestContainsCredentials(project: AbcProject): boolean {
    const wmsLayers = project.layers.filter((lay) => LayerType.Wms === lay.type);
    const withCredentials = wmsLayers.find((lay) => {
      const metadata: WmsMetadata = lay.metadata as WmsMetadata;
      return metadata.auth?.username && metadata.auth?.password;
    });
    return !!withCredentials;
  }
}
