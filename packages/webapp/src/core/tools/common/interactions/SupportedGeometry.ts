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

import { AbcGeometryType } from '@abc-map/shared';

// For the moment, we support only those geometries
// Circles does not serialize in geojson
// Rectangle cannot be modified in a correct way with this method

export declare type SupportedGeometry =
  | typeof AbcGeometryType.POINT
  | typeof AbcGeometryType.MULTI_POINT
  | typeof AbcGeometryType.LINE_STRING
  | typeof AbcGeometryType.MULTI_LINE_STRING
  | typeof AbcGeometryType.MULTI_POLYGON
  | typeof AbcGeometryType.POLYGON;

export const SupportedGeometries: SupportedGeometry[] = [
  AbcGeometryType.POINT,
  AbcGeometryType.MULTI_POINT,
  AbcGeometryType.LINE_STRING,
  AbcGeometryType.MULTI_LINE_STRING,
  AbcGeometryType.MULTI_POLYGON,
  AbcGeometryType.POLYGON,
];
