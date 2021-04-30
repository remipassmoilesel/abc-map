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

import { Feature } from 'ol';
import GeometryType from 'ol/geom/GeometryType';
import { logger, SelectionStyleFactory } from './SelectionStyleFactory';

logger.disable();

describe('SelectionStyleFactory', function () {
  let factory: SelectionStyleFactory;

  beforeEach(() => {
    factory = new SelectionStyleFactory();
  });

  describe('getForFeature()', function () {
    it('Point', function () {
      const feature = fakeFeature(GeometryType.POINT);
      expect(factory.getForFeature(feature)).toHaveLength(1);
    });

    it('LineString', function () {
      const feature = fakeFeature(GeometryType.LINE_STRING);
      expect(factory.getForFeature(feature)).toHaveLength(1);
    });

    it('Polygon', function () {
      const feature = fakeFeature(GeometryType.POLYGON);
      expect(factory.getForFeature(feature)).toHaveLength(1);
    });

    it('Circle', function () {
      const feature = fakeFeature(GeometryType.CIRCLE);
      expect(factory.getForFeature(feature)).toHaveLength(2);
    });

    it('Non supported type', function () {
      const feature = fakeFeature('non supported' as GeometryType);
      expect(factory.getForFeature(feature)).toHaveLength(0);
    });
  });
});

function fakeFeature(geom: GeometryType): Feature {
  return {
    getGeometry() {
      return {
        getType() {
          return geom;
        },
      };
    },
  } as Feature;
}
