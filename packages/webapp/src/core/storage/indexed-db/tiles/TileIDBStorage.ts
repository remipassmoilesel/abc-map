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

import { Logger } from '@abc-map/shared';
import { IndexedDbClient } from '../client/IndexedDbClient';
import { ObjectStore } from '../client/ObjectStore';
import { TileIDBEntry } from './TileIDBEntry';
import { getMainDbClient } from '../main-database';

const logger = Logger.get('TileStorage.ts');

let tileIDBStorage: TileStorage | undefined;

export class TileStorage {
  public static get(): TileStorage {
    if (!tileIDBStorage) {
      tileIDBStorage = new TileStorage(getMainDbClient);
    }

    return tileIDBStorage;
  }

  constructor(private getClient: () => IndexedDbClient | undefined) {}

  public async put(tile: TileIDBEntry): Promise<void> {
    const client = this.getClient();
    if (!client) {
      logger.warn('Not connected, cannot save tile.');
      return;
    }

    await client.put<TileIDBEntry>(ObjectStore.Tiles, tile.url, tile);
  }

  public async get(url: string): Promise<Blob | undefined> {
    const client = this.getClient();
    if (!client) {
      logger.warn('Not connected, cannot get tile.');
      return;
    }

    return client.get<TileIDBEntry>(ObjectStore.Tiles, url).then((entry) => {
      if (!entry) {
        return;
      }

      return entry.image;
    });
  }
}
