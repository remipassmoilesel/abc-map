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
import { AbcLayer, AbcLayout } from '@abc-map/shared';

export interface AbcProjectManifest040 {
  metadata: AbcProjectMetadata040;
  layers: AbcLayer[];
  layouts: AbcLayout[];
}

export interface AbcProjectMetadata040 {
  id: string;
  version: string;
  name: string;
  containsCredentials: boolean;
}

export interface LayoutFormat040 {
  name?: string;
  id: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}
