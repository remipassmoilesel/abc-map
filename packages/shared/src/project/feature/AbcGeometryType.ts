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

/**
 * This enum is the exact copy of openlayers/src/ol/geom/GeometryType.js because:
 * - We need our own type for serialization of projects
 * - And current typings are borked (06/04/2022), these constants are currently typed as strings
 */
export enum AbcGeometryType {
  POINT = 'Point',
  LINE_STRING = 'LineString',
  POLYGON = 'Polygon',
  LINEAR_RING = 'LinearRing',
  MULTI_POINT = 'MultiPoint',
  MULTI_LINE_STRING = 'MultiLineString',
  MULTI_POLYGON = 'MultiPolygon',
  GEOMETRY_COLLECTION = 'GeometryCollection',
  CIRCLE = 'Circle',
}

type OpenlayersGeometryType =
  | 'Point'
  | 'LineString'
  | 'LinearRing'
  | 'Polygon'
  | 'MultiPoint'
  | 'MultiLineString'
  | 'MultiPolygon'
  | 'GeometryCollection'
  | 'Circle';

export function toAbcGeometryType(type: OpenlayersGeometryType): AbcGeometryType {
  switch (type) {
    case 'Point':
      return AbcGeometryType.POINT;
    case 'LineString':
      return AbcGeometryType.LINE_STRING;
    case 'LinearRing':
      return AbcGeometryType.LINEAR_RING;
    case 'Polygon':
      return AbcGeometryType.POLYGON;
    case 'MultiPoint':
      return AbcGeometryType.MULTI_POINT;
    case 'MultiLineString':
      return AbcGeometryType.MULTI_LINE_STRING;
    case 'MultiPolygon':
      return AbcGeometryType.MULTI_POLYGON;
    case 'GeometryCollection':
      return AbcGeometryType.GEOMETRY_COLLECTION;
    case 'Circle':
      return AbcGeometryType.CIRCLE;
  }
}
