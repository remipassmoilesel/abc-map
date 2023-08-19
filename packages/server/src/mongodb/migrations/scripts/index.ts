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

import { MongodbClient } from '../../MongodbClient';
import { DatabaseMigrationScript } from '../DatabaseMigrationScript';
import { S2022_01_04_AddPublicField } from './S2022_01_04_AddPublicField/S2022_01_04_AddPublicField';
import { S2023_08_06_RemoveCredentialsField } from './S2023_08_06_RemoveCredentialsField/S2023_08_06_RemoveCredentialsField';

// Scripts are executed in provided order
export function getScripts(client: MongodbClient): DatabaseMigrationScript[] {
  return [S2022_01_04_AddPublicField.create(client), S2023_08_06_RemoveCredentialsField.create(client)];
}
