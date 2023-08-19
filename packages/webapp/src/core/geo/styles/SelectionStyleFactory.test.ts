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

import { logger, SelectionStyleFactory } from './SelectionStyleFactory';
import { FeatureWrapper } from '../features/FeatureWrapper';
import { SupportedGeometry } from '../../tools/common/interactions/SupportedGeometry';
import { AbcGeometryType } from '@abc-map/shared';

logger.disable();

// TODO: improve tests

describe('SelectionStyleFactory', function () {
  let factory: SelectionStyleFactory;

  beforeEach(() => {
    factory = new SelectionStyleFactory();
  });

  describe('getForFeature()', function () {
    it('Point', function () {
      const feature = fakeFeature(AbcGeometryType.POINT);
      const styles = factory.getForFeature(feature);
      expect(styles).toHaveLength(1);
      expect(styles[0].getZIndex()).toEqual(Infinity);
    });

    it('LineString', function () {
      const feature = fakeFeature(AbcGeometryType.LINE_STRING);
      const styles = factory.getForFeature(feature);
      expect(styles).toHaveLength(1);
      expect(styles[0].getZIndex()).toEqual(Infinity);
    });

    it('Polygon', function () {
      const feature = fakeFeature(AbcGeometryType.POLYGON);
      const styles = factory.getForFeature(feature);
      expect(styles).toHaveLength(1);
      expect(styles[0].getZIndex()).toEqual(Infinity);
    });

    it('Circle', function () {
      const feature = fakeFeature(AbcGeometryType.CIRCLE);
      const styles = factory.getForFeature(feature);
      expect(styles).toHaveLength(2);
      expect(styles[0].getZIndex()).toEqual(Infinity);
      expect(styles[1].getZIndex()).toEqual(Infinity);
    });

    it('Non supported type', function () {
      const feature = fakeFeature('non supported' as SupportedGeometry);
      expect(factory.getForFeature(feature)).toHaveLength(0);
    });
  });
});

function fakeFeature(geom: AbcGeometryType): FeatureWrapper {
  return {
    getGeometry() {
      return {
        getType() {
          return geom;
        },
      };
    },
  } as FeatureWrapper;
}
