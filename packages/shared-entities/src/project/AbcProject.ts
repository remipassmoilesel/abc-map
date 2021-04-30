/**
 * Copyright © 2021 Rémi Pace.
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

import { AbcLayer } from './layer/AbcLayer';
import { AbcLayout } from './layout/AbcLayout';
import { AbcProjection } from './AbcProjection';

/**
 * Version of project, not used for the moment but will be useful for data migrations
 */
export const CurrentVersion = '0.1';

/**
 * Name of main data file in project archive
 */
export const ManifestName = 'project.json';

export interface AbcProject {
  metadata: AbcProjectMetadata;
  layers: AbcLayer[];
  layouts: AbcLayout[];
}

export interface AbcProjectMetadata {
  id: string;
  version: string;
  name: string;
  projection: AbcProjection;
  containsCredentials: boolean;
}
