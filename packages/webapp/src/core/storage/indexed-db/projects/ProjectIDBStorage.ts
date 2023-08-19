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

import { IndexedDbClient } from '../client/IndexedDbClient';
import { ObjectStore } from '../client/ObjectStore';
import { getMainDbClient } from '../main-database';
import { AbcLayout, AbcProjectManifest, AbcSharedView, LayerType, Logger } from '@abc-map/shared';
import { LayerIDBStorage } from '../layers/LayerIDBStorage';
import { ProjectIDBEntry } from './ProjectIDBEntry';
import { FeatureIDBStorage } from '../features/FeatureIDBStorage';
import { GenericReduxIDBStorage } from '../redux/GenericReduxIDBStorage';
import { LayoutIDBStorage } from '../layouts/LayoutIDBStorage';
import { SharedViewIDBStorage } from '../shared-views/SharedViewIDBStorage';

const logger = Logger.get('ProjectIDBStorage.tsx');

/**
 * This is the main storage, from which you can fetch projects and all associated objects.
 */
export class ProjectIDBStorage {
  public static create(): ProjectIDBStorage {
    return new ProjectIDBStorage(getMainDbClient, LayerIDBStorage.create(), LayoutIDBStorage, SharedViewIDBStorage, FeatureIDBStorage.create());
  }

  constructor(
    private getClient: () => IndexedDbClient,
    private layers: LayerIDBStorage,
    private layouts: GenericReduxIDBStorage<AbcLayout>,
    private sharedViews: GenericReduxIDBStorage<AbcSharedView>,
    private features: FeatureIDBStorage
  ) {}

  public async exists(projectId: string): Promise<boolean> {
    const client = this.getClient();
    return client.exists(ObjectStore.Projects, projectId);
  }

  public async put(project: ProjectIDBEntry): Promise<void> {
    const client = this.getClient();
    await client.putAll(ObjectStore.Projects, [{ key: project.metadata.id, value: project }]);
  }

  public async get(projectId: string): Promise<ProjectIDBEntry | undefined> {
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

    const layouts = await this.layouts.getAll(storageEntry.layouts.layoutIds);
    const sharedViews = await this.sharedViews.getAll(storageEntry.sharedViews.viewIds);

    return {
      metadata: storageEntry.metadata,
      view: storageEntry.view,
      layers,
      layouts: {
        list: layouts,
        abcMapAttributionsEnabled: storageEntry.layouts.abcMapAttributionsEnabled,
      },
      sharedViews: {
        fullscreen: storageEntry.sharedViews.fullscreen,
        mapDimensions: storageEntry.sharedViews.mapDimensions,
        list: sharedViews,
      },
    };
  }
}
