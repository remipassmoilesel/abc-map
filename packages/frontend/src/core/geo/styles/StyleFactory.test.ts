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
import { TestHelper } from '../../utils/test/TestHelper';
import { Point } from 'ol/geom';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { StyleCache, StyleCacheEntry } from './StyleCache';
import Style from 'ol/style/Style';
import { IconName } from '../../../assets/point-icons/IconName';
import { FeatureWrapper } from '../features/FeatureWrapper';
import { GeometryType } from '@abc-map/shared';

// TODO: test other geometries

describe('StyleFactory', () => {
  describe('With a fake cache', () => {
    let cache: SinonStubbedInstance<StyleCache>;
    let factory: StyleFactory;
    beforeEach(() => {
      cache = sinon.createStubInstance(StyleCache);
      factory = new StyleFactory(cache as unknown as StyleCache);
    });

    describe('getForFeature()', () => {
      it('should create style then register in cache', () => {
        const feature = FeatureWrapper.create(new Point([1, 1]));
        const properties = TestHelper.sampleStyleProperties();
        feature.setStyleProperties(properties);
        cache.get.returns(undefined);

        const styles = factory.getForFeature(feature, 1);

        expect(styles.length).toEqual(1);
        expect(cache.get.callCount).toEqual(1);
        expect(cache.put.callCount).toEqual(1);
        expect(cache.put.args[0][0]).toEqual('Point');
        expect(cache.put.args[0][1]).toEqual(properties);
        expect(cache.put.args[0][2]).toEqual(1);
        expect(cache.put.args[0][3]).toEqual(styles[0]);
      });

      it('should not create style', () => {
        const feature = FeatureWrapper.create(new Point([1, 1]));
        const properties = TestHelper.sampleStyleProperties();
        feature.setStyleProperties(properties);
        const style = new Style();
        cache.get.returns(style);

        const styles = factory.getForFeature(feature, 1);

        expect(styles.length).toEqual(1);
        expect(cache.get.callCount).toEqual(1);
        expect(cache.put.callCount).toEqual(0);
      });
    });

    describe('getForFeature()', () => {
      it('should sort styles', () => {
        // Prepare
        const cacheContent: StyleCacheEntry[] = [
          { id: '6', ratio: 1, geomType: GeometryType.POLYGON, properties: { fill: { color1: '#FFFFFF' } }, style: new Style() },
          { id: '5', ratio: 1, geomType: GeometryType.POLYGON, properties: { fill: { color1: '#FFFF00' } }, style: new Style() },
          { id: '4', ratio: 1, geomType: GeometryType.POLYGON, properties: { fill: { color1: '#000000' } }, style: new Style() },
          { id: '3', ratio: 1, geomType: GeometryType.POINT, properties: { point: { size: 25 } }, style: new Style() },
          { id: '2', ratio: 1, geomType: GeometryType.POINT, properties: { point: { size: 15 } }, style: new Style() },
          { id: '1', ratio: 1, geomType: GeometryType.POINT, properties: { point: { size: 5 } }, style: new Style() },
        ];
        cache.getAll.returns(cacheContent);

        // Act
        const styles = factory.getAvailableStyles(1);

        // Assert
        expect(styles.map((st) => st.id)).toEqual(['1', '2', '3', '4', '5', '6']);
      });
    });
  });

  describe('With a working cache', () => {
    let factory: StyleFactory;
    beforeEach(() => {
      factory = new StyleFactory();
    });

    describe('getForFeature()', () => {
      it('For point not selected', () => {
        const feature = FeatureWrapper.create(new Point([1, 1]));
        const properties = {
          ...TestHelper.sampleStyleProperties(),
          point: {
            icon: IconName.IconArrow90DegLeft,
            size: 25,
            color: '#ABCDEF',
          },
        };
        feature.setStyleProperties(properties);

        const style = factory.getForFeature(feature, 1);

        expect(style).toHaveLength(1);
        expect(style[0].getImage().getImageSize()).toEqual([25, 25]);
        expect(style[0].getFill()).toBeNull();
        expect(style[0].getStroke()).toBeNull();
      });

      it('For point selected', () => {
        const feature = FeatureWrapper.create(new Point([1, 1]));
        const properties = {
          ...TestHelper.sampleStyleProperties(),
          fill: {
            color1: '#ABCDEF',
          },
          point: {
            icon: IconName.IconArrow90DegLeft,
            size: 25,
          },
        };
        feature.setStyleProperties(properties);
        feature.setSelected(true);

        const style = factory.getForFeature(feature, 1);

        expect(style).toHaveLength(2);
        expect(style[0].getImage().getImageSize()).toEqual([25, 25]);
        expect(style[1]).toBeDefined();
      });
    });
  });
});
