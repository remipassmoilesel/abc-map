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
import { Logger } from '@abc-map/shared';
import { MigrationIDBEntry } from './MigrationIDBEntry';

const logger = Logger.get('MigrationIDBStorage.tsx');

/**
 * This is the main storage, from which you can fetch projects and all associated objects.
 */
export class MigrationIDBStorage {
  constructor(private client: IndexedDbClient) {}

  public async put(entry: MigrationIDBEntry): Promise<void> {
    await this.client.put(ObjectStore.Migrations, entry.name, entry);
  }

  public getAll(): Promise<MigrationIDBEntry[]> {
    return this.client.getAll<MigrationIDBEntry>(ObjectStore.Migrations).then((res) => res.map((entry) => entry.value));
  }
}
