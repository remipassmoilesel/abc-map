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

import { FeatureProperties, FillPatterns, StyleProperties } from '@abc-map/shared';
import { Circle, LineString, Point, Polygon } from 'ol/geom';
import { FeatureWrapper } from './FeatureWrapper';
import { FeatureStyle } from '../style/FeatureStyle';
import { TestHelper } from '../../utils/TestHelper';
import { Style } from 'ol/style';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { PointIcons } from '@abc-map/shared';

describe('FeatureWrapper', () => {
  it('create() should create and set id', () => {
    const feature = FeatureWrapper.create();
    expect(feature.unwrap().getId()).toBeDefined();
  });

  it('from() should not mutate feature', () => {
    const feature = new Feature(new Point([1, 1]));
    const properties = JSON.stringify(feature.getProperties());
    const style = new Style();
    feature.setStyle(style);

    FeatureWrapper.from(feature);

    expect(feature.getId()).toBeUndefined();
    expect(feature.getStyle()).toStrictEqual(style);
    expect(JSON.stringify(feature.getProperties())).toEqual(properties);
  });

  it('clone() should clone feature and geometry', () => {
    const geom = new Circle([5, 5]);
    const feature = FeatureWrapper.create(geom);
    feature.setSelected(true);

    const clone = feature.clone();

    expect(clone.getId()).toEqual(feature.getId());
    expect(clone).not.toStrictEqual(feature);
    expect(clone.unwrap()).not.toStrictEqual(feature.unwrap());
    expect(clone.isSelected()).toEqual(feature.isSelected());
    expect(clone.getGeometry()?.getExtent()).toEqual(feature.getGeometry()?.getExtent());
    expect(clone.getGeometry()).not.toStrictEqual(feature.getGeometry());

    clone.setSelected(false);
    expect(clone.isSelected()).toEqual(false);
    expect(feature.isSelected()).toEqual(true);
  });

  describe('setId()', () => {
    it('should generate id', () => {
      const feature = FeatureWrapper.create();
      const id1 = feature.setId().getId();
      const id2 = feature.setId().getId();

      expect(id1).toHaveLength(10);
      expect(id1).not.toEqual(id2);
    });

    it('should set id', () => {
      const feature = FeatureWrapper.create();
      expect(feature.setId(1234).getId()).toEqual(1234);
      expect(feature.setId('abcd').getId()).toEqual('abcd');
    });

    it('should set id even if id is zero', () => {
      const feature = FeatureWrapper.create();
      expect(feature.setId(0).getId()).toEqual(0);
    });
  });

  describe('setSelected(), isSelected()', () => {
    it('setSelected() should set property', () => {
      const feature = FeatureWrapper.create();

      feature.setSelected(true);

      expect(feature.unwrap().get(FeatureProperties.Selected)).toBe(true);
      expect(feature.isSelected()).toBe(true);
    });

    it('setSelected() should apply style', () => {
      const feature = FeatureWrapper.create();
      expect(feature.unwrap().getStyle()).toBeNull();

      feature.setSelected(true);

      expect(feature.unwrap().getStyle()).not.toBeNull();
    });

    it('isSelected() should return true', () => {
      const feature = FeatureWrapper.create();
      feature.unwrap().set(FeatureProperties.Selected, true);

      expect(feature.isSelected()).toBe(true);
    });

    it('isSelected() should return false', () => {
      const feature = FeatureWrapper.create();
      feature.unwrap().set(FeatureProperties.Selected, undefined);

      expect(feature.isSelected()).toBe(false);
    });
  });

  describe('Style', () => {
    describe('setDefaultStyle()', () => {
      it('On polygon', () => {
        // Prepare
        const feature = FeatureWrapper.create(
          new Polygon([
            [
              [1, 1],
              [2, 2],
              [1, 1],
            ],
          ])
        );

        // Act
        feature.setDefaultStyle();

        // Assert
        expect(feature.getStyleProperties()).toEqual({
          fill: { color1: '#fff', color2: undefined, pattern: undefined },
          stroke: { color: '#000', width: 2 },
          point: { icon: undefined, size: undefined },
          text: { alignment: undefined, color: undefined, font: undefined, offsetX: undefined, offsetY: undefined, size: undefined, value: undefined },
        });
      });

      it('On point', () => {
        // Prepare
        const feature = FeatureWrapper.create(new Point([1, 1]));

        // Act
        feature.setDefaultStyle();

        // Assert
        expect(feature.getStyleProperties()).toEqual({
          point: { icon: PointIcons.Square, size: 15 },
          fill: { color1: undefined, color2: undefined, pattern: undefined },
          stroke: { color: undefined, width: undefined },
          text: { alignment: undefined, color: undefined, font: undefined, offsetX: undefined, offsetY: undefined, size: undefined, value: undefined },
        });
      });

      it('On line string', () => {
        // Prepare
        const feature = FeatureWrapper.create(
          new LineString([
            [1, 1],
            [2, 2],
            [1, 1],
          ])
        );

        // Act
        feature.setDefaultStyle();

        // Assert
        expect(feature.getStyleProperties()).toEqual({
          stroke: { color: '#000', width: 2 },
          fill: { color1: undefined, color2: undefined, pattern: undefined },
          point: { icon: undefined, size: undefined },
          text: { alignment: undefined, color: undefined, font: undefined, offsetX: undefined, offsetY: undefined, size: undefined, value: undefined },
        });
      });
    });

    it('applyStyle()', () => {
      const feature = FeatureWrapper.create(new Point([4, 5]));
      expect(feature.unwrap().getStyle()).toBeNull();

      feature.applyStyle();

      expect(feature.unwrap().getStyle()).not.toBeNull();
    });

    describe('setStyleProperties()', () => {
      it('should set all properties', () => {
        const feature = FeatureWrapper.create();

        feature.setStyleProperties(TestHelper.sampleStyleProperties());

        const ol = feature.unwrap();
        expect(ol.get(StyleProperties.StrokeColor)).toEqual('#000000');
        expect(ol.get(StyleProperties.StrokeWidth)).toEqual(5);
        expect(ol.get(StyleProperties.FillColor1)).toEqual('#FFFFFF');
        expect(ol.get(StyleProperties.FillColor2)).toEqual('#FF0000');
        expect(ol.get(StyleProperties.FillPattern)).toEqual(FillPatterns.HatchingObliqueLeft);
        expect(ol.get(StyleProperties.TextValue)).toEqual('Test text value');
        expect(ol.get(StyleProperties.TextColor)).toEqual('#0000FF');
        expect(ol.get(StyleProperties.TextSize)).toEqual(30);
        expect(ol.get(StyleProperties.TextFont)).toEqual('sans-serif');
        expect(ol.get(StyleProperties.TextOffsetX)).toEqual(20);
        expect(ol.get(StyleProperties.TextOffsetY)).toEqual(30);
        expect(ol.get(StyleProperties.TextAlignment)).toEqual('left');
        expect(ol.get(StyleProperties.PointIcon)).toEqual('star');
        expect(ol.get(StyleProperties.PointSize)).toEqual(5);
        expect(ol.get(StyleProperties.PointColor)).toEqual('#00FF00');
      });

      it('setStyleProperties() should not set undefined properties', () => {
        const feature = FeatureWrapper.create();

        feature.setStyleProperties({ point: { icon: 'test-icon' } });

        expect(feature.getAllProperties()).toEqual({ 'abc:style:point:icon': 'test-icon' });
      });

      it('setStyleProperties() should apply style', () => {
        const feature = FeatureWrapper.create();
        expect(feature.unwrap().getStyle()).toBeNull();

        feature.setStyleProperties(TestHelper.sampleStyleProperties());

        expect(feature.unwrap().getStyle()).not.toBeNull();
      });
    });

    it('getStyleProperties()', () => {
      const feature = FeatureWrapper.create();
      feature.unwrap().set(StyleProperties.StrokeWidth, 5);
      feature.unwrap().set(StyleProperties.StrokeColor, '#000000');
      feature.unwrap().set(StyleProperties.FillColor1, '#FFFFFF');
      feature.unwrap().set(StyleProperties.FillColor2, '#FF0000');
      feature.unwrap().set(StyleProperties.FillPattern, FillPatterns.HatchingObliqueLeft);
      feature.unwrap().set(StyleProperties.TextValue, 'Test text value');
      feature.unwrap().set(StyleProperties.TextColor, '#0000FF');
      feature.unwrap().set(StyleProperties.TextSize, 30);
      feature.unwrap().set(StyleProperties.TextFont, 'sans-serif');
      feature.unwrap().set(StyleProperties.TextOffsetX, 20);
      feature.unwrap().set(StyleProperties.TextOffsetY, 30);
      feature.unwrap().set(StyleProperties.TextAlignment, 'left');
      feature.unwrap().set(StyleProperties.PointIcon, PointIcons.Star);
      feature.unwrap().set(StyleProperties.PointSize, 5);
      feature.unwrap().set(StyleProperties.PointColor, '#00FF00');

      const properties = feature.getStyleProperties();

      const expected: FeatureStyle = TestHelper.sampleStyleProperties();
      expect(properties).toEqual(expected);
    });
  });

  describe('setText()', () => {
    it('should work', () => {
      const feature = FeatureWrapper.create();
      feature.setStyleProperties(TestHelper.sampleStyleProperties());

      feature.setText('Sample text');

      expect(feature.unwrap().get(StyleProperties.StrokeWidth)).toEqual(5);
      expect(feature.unwrap().get(StyleProperties.StrokeColor)).toEqual('#000000');
      expect(feature.unwrap().get(StyleProperties.FillColor1)).toEqual('#FFFFFF');
      expect(feature.unwrap().get(StyleProperties.FillColor2)).toEqual('#FF0000');
      expect(feature.unwrap().get(StyleProperties.FillPattern)).toEqual(FillPatterns.HatchingObliqueLeft);
    });

    it('should apply style', () => {
      const feature = FeatureWrapper.create();
      expect(feature.unwrap().getStyle()).toBeNull();

      feature.setText('Sample text');

      expect(feature.unwrap().getStyle()).not.toBeNull();
    });
  });

  it('getAllProperties()', () => {
    const feature = new Feature<Geometry>();
    feature.set(StyleProperties.FillColor2, 'black');
    feature.setGeometry(new Point([1, 2]));

    const properties = FeatureWrapper.from(feature).getAllProperties();
    expect(properties).toEqual({
      [StyleProperties.FillColor2]: 'black',
      geometry: feature.getGeometry(),
    });
  });

  it('getSimpleProperties()', () => {
    const feature = new Feature<Geometry>();
    feature.set(StyleProperties.FillColor2, 'black');
    feature.set('name', 'Amsterdam');
    feature.set('population', 12345);
    feature.setGeometry(new Point([1, 2]));

    const properties = FeatureWrapper.from(feature).getSimpleProperties();
    expect(properties).toEqual({
      name: 'Amsterdam',
      population: 12345,
    });
  });

  it('setProperties()', () => {
    const feature = FeatureWrapper.create(new Point([1, 1]));
    feature.unwrap().set('code', '#abcd');
    feature.unwrap().set('population', 123);

    feature.setProperties({ population: 123 });

    const properties = feature.getAllProperties();
    expect(properties).toEqual({
      code: '#abcd',
      population: 123,
      geometry: feature.getGeometry(),
    });
  });

  it('overwriteSimpleProperties()', () => {
    const feature = FeatureWrapper.create(new Point([1, 1]));
    feature.unwrap().set('code', '#abcd');
    feature.unwrap().set('population', 123);

    feature.overwriteSimpleProperties({ population: 123 });

    const properties = feature.getAllProperties();
    expect(properties).toEqual({
      population: 123,
      geometry: feature.getGeometry(),
    });
  });
});
