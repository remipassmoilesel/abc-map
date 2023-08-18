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

import { IndexedDbMigration } from './IndexedDbMigration';
import { M20230806 } from './M20230806/M20230806';
import { M20230816 } from './M20230816/M20230816';

export declare type MigrationsFactory = () => IndexedDbMigration[];

export function getMigrations(): IndexedDbMigration[] {
  return [new M20230806(), new M20230816()];
}
