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

/**
 * When writing a migration, keep in mind that projects can be migrated using webapp/src/core/project/migrations
 */
export interface IndexedDbMigration {
  getName(): string;
  process(context: StorageMigrationContext): Promise<void>;
}

export interface StorageMigrationContext {
  client: IndexedDbClient;
}
