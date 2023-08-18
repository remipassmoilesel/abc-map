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
import { AbcLayer, AbcLayout, AbcSharedView, AbcView } from '@abc-map/shared';

export interface AbcProjectManifest090 {
  metadata: AbcProjectMetadata090;
  sharedViews: {
    list: AbcSharedView[];
    fullscreen: boolean;
    mapDimensions: { width: number; height: number };
  };
  layouts: AbcLayout[];
  view: AbcView;
  layers: AbcLayer[];
}

export interface AbcProjectMetadata090 {
  id: string;
  version: string;
  name: string;
  public: boolean;
  containsCredentials: boolean;
}
