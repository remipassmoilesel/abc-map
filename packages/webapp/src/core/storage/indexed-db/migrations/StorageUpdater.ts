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
import { getMigrations, MigrationsFactory } from './migrations';
import { IndexedDbClient } from '../client/IndexedDbClient';
import { StorageMigrationContext } from './IndexedDbMigration';
import { MigrationIDBStorage } from './MigrationIDBStorage';

export const logger = Logger.get('StorageUpdater.ts', 'debug');

export function disableStorageMigrationLogs() {
  logger.disable();
}

/**
 * This helper migrate Indexed DB data
 */
export class StorageUpdater {
  public static create() {
    return new StorageUpdater(getMigrations);
  }

  constructor(private migrations: MigrationsFactory) {}

  public async update(client: IndexedDbClient): Promise<void> {
    const migrations = this.migrations();
    const migrationStorage = new MigrationIDBStorage(client);
    const migrationsAlreadyDone = await migrationStorage.getAll();

    const context: StorageMigrationContext = { client };

    for (const migration of migrations) {
      const alreadyDone = migrationsAlreadyDone.find((migr) => migr.name === migration.getName());
      if (!alreadyDone) {
        logger.warn(`Executing IndexedDB schema migration: ${migration.getName()}`);
        await migration.process(context);
        await migrationStorage.put({ name: migration.getName(), when: Date.now() });
      }
    }
  }
}
