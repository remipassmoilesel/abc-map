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

import { AbcGeometryType } from '@abc-map/shared';
import { Type } from 'ol/geom/Geometry';

describe('Geometry typing', () => {
  /**
   * AbcGeometryType is the exact copy of openlayers/src/ol/geom/GeometryType.js because:
   * - We need our own type for serialization of projects
   * - And current openlayers typings are borked (06/04/2022), these constants are currently typed as strings
   */
  it('AbcGeometryType is compatible with openlayers geometry type typing', () => {
    // This tests fails if typescript compilation fail
    const abcTypes: Type[] = [
      AbcGeometryType.POINT,
      AbcGeometryType.LINE_STRING,
      AbcGeometryType.POLYGON,
      AbcGeometryType.LINEAR_RING,
      AbcGeometryType.MULTI_POINT,
      AbcGeometryType.MULTI_LINE_STRING,
      AbcGeometryType.MULTI_POLYGON,
      AbcGeometryType.GEOMETRY_COLLECTION,
      AbcGeometryType.CIRCLE,
    ];

    const olTypes: Type[] = ['Point', 'LineString', 'Polygon', 'LinearRing', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection', 'Circle'];

    expect(abcTypes).toEqual(olTypes);
  });
});
