/**
 * Copyright © 2022 Rémi Pace.
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

import { IndexedDbClient } from '../indexed-db/IndexedDbClient';
import { ObjectStore } from './ObjectStore';
import { getProjectsDbClient } from './projects-database';
import { AbcLayout, AbcProjectManifest, AbcSharedView, LayerType } from '@abc-map/shared';
import { LayerDbStorage } from './LayerDbStorage';
import { ProjectDbStorageEntry } from './ProjectDbStorageEntry';
import { FeatureDbStorage } from './FeatureDbStorage';
import { GenericReduxDbStorage } from './GenericReduxDbStorage';

export const LayoutStorage = GenericReduxDbStorage.create<AbcLayout>(ObjectStore.Layouts, (st) => st.project.layouts.list);
export const SharedViewStorage = GenericReduxDbStorage.create<AbcSharedView>(ObjectStore.SharedViews, (st) => st.project.sharedViews.list);

/**
 * This is the main storage, from wich you can fetch projects and all associated objects.
 */
export class ProjectDbStorage {
  public static create(): ProjectDbStorage {
    return new ProjectDbStorage(getProjectsDbClient, LayerDbStorage.create(), LayoutStorage, SharedViewStorage, FeatureDbStorage.create());
  }

  constructor(
    private getClient: () => IndexedDbClient,
    private layers: LayerDbStorage,
    private layouts: GenericReduxDbStorage<AbcLayout>,
    private sharedViews: GenericReduxDbStorage<AbcSharedView>,
    private features: FeatureDbStorage
  ) {}

  public async exists(projectId: string): Promise<boolean> {
    const client = this.getClient();
    return client.exists(ObjectStore.Projects, projectId);
  }

  public async put(project: ProjectDbStorageEntry): Promise<void> {
    const client = this.getClient();
    await client.putAll(ObjectStore.Projects, [{ key: project.metadata.id, value: project }]);
  }

  public async get(projectId: string): Promise<ProjectDbStorageEntry | undefined> {
    const client = this.getClient();
    return client.get(ObjectStore.Projects, projectId);
  }

  public async getManifest(projectId: string): Promise<AbcProjectManifest | undefined> {
    const storageEntry = await this.get(projectId);
    if (!storageEntry) {
      return;
    }

    const layers = await this.layers.getAll(storageEntry.layerIds);

    // We fetch features
    for (const layer of layers) {
      if (layer.type === LayerType.Vector) {
        layer.features = {
          ...layer.features,
          features: await this.features.getAllByLayerId(layer.metadata.id),
        };
      }
    }

    const layouts = await this.layouts.getAll(storageEntry.layoutIds);
    const sharedViews = await this.sharedViews.getAll(storageEntry.sharedViews.viewIds);

    return {
      metadata: storageEntry.metadata,
      view: storageEntry.view,
      layers,
      layouts,
      sharedViews: {
        fullscreen: storageEntry.sharedViews.fullscreen,
        mapDimensions: storageEntry.sharedViews.mapDimensions,
        list: sharedViews,
      },
    };
  }
}
