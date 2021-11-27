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

import GeometryType from 'ol/geom/GeometryType';

// For the moment, we support only those geometries
// Circles does not serialize in geojson
// Rectangle cannot be modified in a correct way with this method

export declare type SupportedGeometry =
  | typeof GeometryType.POINT
  | typeof GeometryType.MULTI_POINT
  | typeof GeometryType.LINE_STRING
  | typeof GeometryType.MULTI_LINE_STRING
  | typeof GeometryType.MULTI_POLYGON
  | typeof GeometryType.POLYGON;

export const AllSupportedGeometries: SupportedGeometry[] = [
  GeometryType.POINT,
  GeometryType.MULTI_POINT,
  GeometryType.LINE_STRING,
  GeometryType.MULTI_LINE_STRING,
  GeometryType.MULTI_POLYGON,
  GeometryType.POLYGON,
];
