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
import { AbcGeometryType } from '@abc-map/shared';

describe('OlGeometry', () => {
  /**
   * AbcGeometryType is the exact copy of openlayers/src/ol/geom/GeometryType.js because:
   * - We need our own type for serialization of projects
   * - And current openlayers typings are borked (06/04/2022), these constants are currently typed as strings
   */
  it('GeometryType', () => {
    expect(GeometryType).toEqual(AbcGeometryType);
  });
});
