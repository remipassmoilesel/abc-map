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
import { AbcLayout, AbcSharedView } from '@abc-map/shared';
import { AbcLegend060 } from './060-legend-types';

export interface AbcProjectManifest070 {
  metadata: AbcProjectMetadata070;
  layouts: AbcLayout070[];
  sharedViews: AbcSharedView070[];
  view: any;
  layers: any[];
}

export interface AbcLayout070 extends AbcLayout {
  legend: AbcLegend060;
}

export interface AbcSharedView070 extends AbcSharedView {
  legend: AbcLegend060;
}

export interface AbcProjectMetadata070 {
  id: string;
  version: string;
  name: string;
  public: boolean;
  containsCredentials: boolean;
}
