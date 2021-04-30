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

import { StyleFactory } from './StyleFactory';
import { TestHelper } from '../../utils/TestHelper';
import Geometry from 'ol/geom/Geometry';
import { Point } from 'ol/geom';
import { SinonStubbedInstance } from 'sinon';
import { StyleCache } from './StyleCache';
import * as sinon from 'sinon';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import { safeGetIcon } from './PointIcons';
import { PointIcons } from '@abc-map/shared-entities';
import { IconProcessor } from './IconProcessor';

// TODO: test other geometries

describe('StyleFactory', () => {
  describe('With a fake cache', () => {
    let cache: SinonStubbedInstance<StyleCache>;
    let factory: StyleFactory;
    beforeEach(() => {
      cache = sinon.createStubInstance(StyleCache);
      factory = new StyleFactory((cache as unknown) as StyleCache);
    });

    it('should create style then register in cache', () => {
      const feature = new Feature<Geometry>(new Point([1, 1]));
      const properties = TestHelper.sampleStyleProperties();
      cache.get.returns(undefined);

      const styles = factory.getFor(feature, properties, false);

      expect(styles.length).toEqual(1);
      expect(cache.get.callCount).toEqual(1);
      expect(cache.put.callCount).toEqual(1);
      expect(cache.put.args[0][0]).toEqual('Point');
      expect(cache.put.args[0][1]).toEqual(properties);
      expect(cache.put.args[0][2]).toEqual(styles);
    });

    it('should not create style', () => {
      const feature = new Feature<Geometry>(new Point([1, 1]));
      const properties = TestHelper.sampleStyleProperties();
      const style = new Style();
      cache.get.returns([style]);

      const styles = factory.getFor(feature, properties, false);

      expect(styles.length).toEqual(1);
      expect(cache.get.callCount).toEqual(1);
      expect(cache.put.callCount).toEqual(0);
    });
  });

  describe('With a working cache', () => {
    let factory: StyleFactory;
    beforeEach(() => {
      factory = new StyleFactory();
    });

    it('For point not selected', () => {
      const feature = new Feature<Geometry>(new Point([1, 1]));
      const properties = {
        ...TestHelper.sampleStyleProperties(),
        point: {
          icon: PointIcons.Square,
          size: 25,
          color: '#ABCDEF',
        },
      };

      const style = factory.getFor(feature, properties, false);

      expect(style).toHaveLength(1);
      expect(style[0].getImage().getImageSize()).toEqual([25, 25]);
      const image = style[0].getImage().getImage(1) as HTMLImageElement;
      expect(image).toBeInstanceOf(HTMLImageElement);
      expect(image).toEqual(IconProcessor.prepare(safeGetIcon(PointIcons.Square), 25, '#ABCDEF'));
      expect(style[0].getFill()).toBeNull();
      expect(style[0].getStroke()).toBeNull();
    });

    it('For point selected', () => {
      const feature = new Feature<Geometry>(new Point([1, 1]));
      const properties = {
        ...TestHelper.sampleStyleProperties(),
        fill: {
          color1: '#ABCDEF',
        },
        point: {
          icon: PointIcons.Square,
          size: 25,
        },
      };

      const style = factory.getFor(feature, properties, true);

      expect(style).toHaveLength(2);
      expect(style[0].getImage().getImageSize()).toEqual([25, 25]);
      expect(style[1]).toBeDefined();
    });
  });
});
