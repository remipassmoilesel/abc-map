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

import { Logger } from '@abc-map/shared';
import { IndexedDbClient } from '../client/IndexedDbClient';
import { DbStorage } from '../DbStorage';
import { TileDbStorageEntry } from './TileDbStorageEntry';
import { getProjectsDbClient } from '../projects-database';

const logger = Logger.get('TileStorage.ts');

let tileDbStorage: TileStorage | undefined;

export class TileStorage {
  public static get(): TileStorage {
    if (!tileDbStorage) {
      tileDbStorage = new TileStorage(getProjectsDbClient());
    }

    return tileDbStorage;
  }

  constructor(private client: IndexedDbClient) {}

  public async put(tile: TileDbStorageEntry): Promise<void> {
    await this.client.put(DbStorage.Tiles, tile.url, tile.image);
  }

  public async get(url: string): Promise<Blob | undefined> {
    return this.client.get<Blob>(DbStorage.Tiles, url);
  }
}
