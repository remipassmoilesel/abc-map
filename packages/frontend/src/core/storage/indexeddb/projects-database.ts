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

import { DbStorage } from './DbStorage';
import { IndexedDbClient } from './client/IndexedDbClient';
import { FeatureDbStorageEntry } from './storage/FeatureDbStorageEntry';
import { TileDbStorageEntry } from './storage/TileDbStorageEntry';

export const ProjectsDatabase = 'abc-map_projects';

export const Features_LayerIdIndex = 'Features_LayerIdIndex';
export const Tiles_UrlIndex = 'Tiles_UrlIndex';

let client: IndexedDbClient | undefined;

export async function initProjectDatabase() {
  client?.disconnect();
  client = new IndexedDbClient();

  await client.connect(ProjectsDatabase, 1, (db) => {
    db.createObjectStore(DbStorage.Projects);

    db.createObjectStore(DbStorage.Layers);

    db.createObjectStore(DbStorage.Layouts);

    db.createObjectStore(DbStorage.SharedViews);

    const featureStore = db.createObjectStore(DbStorage.Features);
    const featuresIndex1: keyof FeatureDbStorageEntry = 'layerId';
    featureStore.createIndex(Features_LayerIdIndex, featuresIndex1);

    const tileStore = db.createObjectStore(DbStorage.Tiles);
    const tilesIndex1: keyof TileDbStorageEntry = 'url';
    tileStore.createIndex(Tiles_UrlIndex, tilesIndex1);
  });
}

export function getProjectsDbClient(): IndexedDbClient {
  if (!client) {
    throw new Error('Not connected');
  }

  return client;
}
