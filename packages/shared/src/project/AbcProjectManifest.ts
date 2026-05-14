/**
 * Copyright © 2026 Rémi Pace.
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

import type { AbcLayer } from './layer/index.js';
import type { AbcLayout } from './layout/index.js';
import type { AbcView } from './AbcView.js';
import type { AbcSharedView } from './shared-views/index.js';

export interface AbcProjectManifest {
  // Metadata: id, version, etc ...
  metadata: AbcProjectMetadata;
  // Main view for edition
  view: AbcView;
  // Layers: raster, geometries, ...
  layers: AbcLayer[];
  // Layouts for PDF exports
  layouts: {
    abcMapAttributionsEnabled: boolean;
    list: AbcLayout[];
  };
  // Views publicly accessible
  sharedViews: {
    // If true, map is fullscreen
    fullscreen: boolean;
    // If not fullscreen, these dimensions are used
    mapDimensions: { width: number; height: number };
    // List of views
    list: AbcSharedView[];
  };
}

export interface AbcProjectMetadata {
  id: string;
  version: string;
  name: string;
  // True if project can be accessed publicly
  public: boolean;
}
