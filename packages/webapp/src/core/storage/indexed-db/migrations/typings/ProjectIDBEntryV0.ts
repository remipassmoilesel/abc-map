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

import { AbcView } from '@abc-map/shared';

export interface ProjectIDBEntryV0 {
  version?: number;
  // Metadata: id, version, etc ...
  metadata: IDBProjectMetadataV0;
  // Main view for edition
  view: AbcView;
  layerIds: string[];
  // Layouts for static exports
  layoutIds: string[];
  // Views publicly accessible
  sharedViews: {
    // If true, map is fullscreen
    fullscreen: boolean;
    // If not fullscreen, these dimensions are used
    mapDimensions: { width: number; height: number };
    // List of views
    viewIds: string[];
  };
}

export interface IDBProjectMetadataV0 {
  id: string;
  version: string;
  name: string;
  public: boolean;
  // This field has not been removed in a previous migration
  containsCredentials?: boolean;
}
