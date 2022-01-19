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

import { AbcLayer } from './layer';
import { AbcLayout } from './layout';
import { AbcLegend } from './legend';
import { AbcView } from './AbcView';
import { AbcSharedView } from './shared-views';

export interface AbcProjectManifest {
  // Metadata: id, version, etc ...
  metadata: AbcProjectMetadata;
  // Main view for edition
  view: AbcView;
  // Layers: raster, geometries, ...
  layers: AbcLayer[];
  // Layouts for PDF exports
  layouts: AbcLayout[];
  // Main legend
  legend: AbcLegend;
  // Views publicly accessible
  sharedViews: AbcSharedView[];
}

export interface AbcProjectMetadata {
  id: string;
  version: string;
  name: string;
  // True if project contains encrypted credentials, false otherwise
  containsCredentials: boolean;
  // True if project can be accessed publicly
  public: boolean;
}
