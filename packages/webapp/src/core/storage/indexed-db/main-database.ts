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

import { ObjectStore } from './client/ObjectStore';
import { IndexedDbClient } from './client/IndexedDbClient';
import { FeatureIDBEntry } from './features/FeatureIDBEntry';
import { TileIDBEntry } from './tiles/TileIDBEntry';
import { StorageUpdater } from './migrations/StorageUpdater';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('initMainDatabase.ts');

export const MainDatabase = 'abc-map_projects';

export const Features_LayerIdIndex = 'Features_LayerIdIndex';
export const Tiles_UrlIndex = 'Tiles_UrlIndex';

let client: IndexedDbClient | undefined;

/**
 * Return Indexed DB client if connected.
 *
 * Sometimes Indexed DB may be unavailable, and sometimes it may become stuck, so you need to ensure that the features can work without it.
 */
export function getMainDbClient(): IndexedDbClient | undefined {
  if (!client || !client.isConnected()) {
    logger.warn('Client not available, not connected');
    return;
  }

  return client;
}

export async function initMainDatabase() {
  client?.disconnect();
  client = new IndexedDbClient();

  await client.connect(MainDatabase, 2, (db) => {
    if (!db.objectStoreNames.contains(ObjectStore.Projects)) {
      db.createObjectStore(ObjectStore.Projects);
    }

    if (!db.objectStoreNames.contains(ObjectStore.Layers)) {
      db.createObjectStore(ObjectStore.Layers);
    }

    if (!db.objectStoreNames.contains(ObjectStore.Layouts)) {
      db.createObjectStore(ObjectStore.Layouts);
    }

    if (!db.objectStoreNames.contains(ObjectStore.SharedViews)) {
      db.createObjectStore(ObjectStore.SharedViews);
    }

    if (!db.objectStoreNames.contains(ObjectStore.Features)) {
      const featureStore = db.createObjectStore(ObjectStore.Features);
      const featuresIndex1: keyof FeatureIDBEntry = 'layerId';
      featureStore.createIndex(Features_LayerIdIndex, featuresIndex1);
    }

    if (!db.objectStoreNames.contains(ObjectStore.Tiles)) {
      const tileStore = db.createObjectStore(ObjectStore.Tiles);
      const tilesIndex1: keyof TileIDBEntry = 'url';
      tileStore.createIndex(Tiles_UrlIndex, tilesIndex1);
    }

    if (!db.objectStoreNames.contains(ObjectStore.Migrations)) {
      db.createObjectStore(ObjectStore.Migrations);
    }
  });

  const updater = StorageUpdater.create();
  await updater.update(client);
}
