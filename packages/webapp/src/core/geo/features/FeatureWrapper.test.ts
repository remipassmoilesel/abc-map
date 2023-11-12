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

import { AbcGeometryType, DefaultStyle, FeatureProperties, FeatureStyle, FillPatterns, StyleProperties } from '@abc-map/shared';
import { Circle, LineString, Point, Polygon } from 'ol/geom';
import { FeatureWrapper, HlPreviousStyleKey, HlStyleKey } from './FeatureWrapper';
import { TestHelper } from '../../utils/test/TestHelper';
import { Style } from 'ol/style';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { IconName } from '@abc-map/point-icons';
import * as sinon from 'sinon';

describe('FeatureWrapper', () => {
  describe('create(), from(), fromUnknwon()', () => {
    it('create() should create and set id', () => {
      const feature = FeatureWrapper.create();
      expect(feature.unwrap().getId()).toBeDefined();
    });

    it('from() should fail', () => {
      expect(() => FeatureWrapper.from({} as any)).toThrow('Invalid feature: [object Object]');
    });

    it('from() should not wrap twice', () => {
      const feature = FeatureWrapper.create();

      expect(FeatureWrapper.from(feature)).toStrictEqual(feature);
    });

    it('from() should work and not mutate feature', () => {
      const feature = new Feature(new Point([1, 1]));
      const properties = JSON.stringify(feature.getProperties());
      const style = new Style();
      feature.setStyle(style);

      FeatureWrapper.from(feature);

      expect(feature.getId()).toBeUndefined();
      expect(feature.getStyle()).toStrictEqual(style);
      expect(JSON.stringify(feature.getProperties())).toEqual(properties);
    });

    it('fromUnknown()', () => {
      const ol = new Feature(new Point([1, 1]));

      expect(FeatureWrapper.fromUnknown(ol)).toBeDefined();
      expect(FeatureWrapper.fromUnknown(undefined)).toBeUndefined();
      expect(FeatureWrapper.fromUnknown(new Style())).toBeUndefined();
    });

    it('fromUnknown() should not wrap twice', () => {
      const feature = FeatureWrapper.create();

      expect(FeatureWrapper.fromUnknown(feature)).toStrictEqual(feature);
    });

    it('fromGeoJSON()', () => {
      expect(FeatureWrapper.fromGeoJSON(TestHelper.sampleGeojsonFeature())).toBeDefined();
      expect(() => FeatureWrapper.fromGeoJSON({} as any)).toThrow();
      expect(() => FeatureWrapper.fromGeoJSON(undefined as any)).toThrow();
    });
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
          fill: { ...DefaultStyle.fill },
          stroke: { ...DefaultStyle.stroke },
          point: {},
          text: {},
        });
      });

      it('On point', () => {
        // Prepare
        const feature = FeatureWrapper.create(new Point([1, 1]));

        // Act
        feature.setDefaultStyle();

        // Assert
        expect(feature.getStyleProperties()).toEqual({
          point: { ...DefaultStyle.point },
          fill: {},
          stroke: {},
          text: {},
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
          stroke: { ...DefaultStyle.stroke },
          fill: {},
          point: {},
          text: {},
        });
      });

      it('On line string with text', () => {
        // Prepare
        const feature = FeatureWrapper.create(
          new LineString([
            [1, 1],
            [2, 2],
            [1, 1],
          ])
        );
        feature.setText('Ho !');

        // Act
        feature.setDefaultStyle();

        // Assert
        expect(feature.getStyleProperties()).toEqual({
          stroke: { ...DefaultStyle.stroke },
          text: {
            ...DefaultStyle.text,
            value: 'Ho !',
          },
          fill: {},
          point: {},
        });
      });
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
        expect(ol.get(StyleProperties.TextFont)).toEqual('AbcCantarell');
        expect(ol.get(StyleProperties.TextOffsetX)).toEqual(20);
        expect(ol.get(StyleProperties.TextOffsetY)).toEqual(30);
        expect(ol.get(StyleProperties.TextAlignment)).toEqual('left');
        expect(ol.get(StyleProperties.PointIcon)).toEqual(IconName.IconMoonStars);
        expect(ol.get(StyleProperties.PointSize)).toEqual(5);
        expect(ol.get(StyleProperties.PointColor)).toEqual('#00FF00');
        expect(ol.get(StyleProperties.ZIndex)).toEqual(5);
      });

      it('setStyleProperties() should not set undefined properties', () => {
        const feature = FeatureWrapper.create();

        feature.setStyleProperties({ point: { icon: 'test-icon' } });

        expect(feature.getAllProperties()).toEqual({ 'abc:style:point:icon': 'test-icon' });
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
      feature.unwrap().set(StyleProperties.TextFont, 'AbcCantarell');
      feature.unwrap().set(StyleProperties.TextOffsetX, 20);
      feature.unwrap().set(StyleProperties.TextOffsetY, 30);
      feature.unwrap().set(StyleProperties.TextAlignment, 'left');
      feature.unwrap().set(StyleProperties.TextRotation, 5);
      feature.unwrap().set(StyleProperties.PointIcon, IconName.IconMoonStars);
      feature.unwrap().set(StyleProperties.PointSize, 5);
      feature.unwrap().set(StyleProperties.PointColor, '#00FF00');
      feature.unwrap().set(StyleProperties.ZIndex, 5);

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

  it('getDataProperties()', () => {
    const feature = new Feature<Geometry>();
    feature.set(StyleProperties.FillColor2, 'black');
    feature.set('name', 'Amsterdam');
    feature.set('population', 12345);
    feature.set('updated', false);
    feature.setGeometry(new Point([1, 2]));
    feature.set('tags', ['tag1', 'tag2']);
    feature.set('properties', { color: 'blue' });

    const dataProperties = FeatureWrapper.from(feature).getDataProperties();
    expect(dataProperties).toEqual({
      name: 'Amsterdam',
      population: 12345,
      updated: false,
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

  describe('setDataProperties()', () => {
    it('should work', () => {
      const feature = FeatureWrapper.create(new Point([1, 1]));
      feature.unwrap().set('code', '#abcd');
      feature.unwrap().set('population', 123);

      feature.setDataProperties({ population: 123 });

      const properties = feature.getAllProperties();
      expect(properties).toEqual({
        population: 123,
        geometry: feature.getGeometry(),
      });
    });

    it('should emit change event', () => {
      const listenerStub = sinon.stub();
      const feature = FeatureWrapper.create(new Point([1, 1]));
      feature.unwrap().on('propertychange', listenerStub);

      feature.setDataProperties({ population: 123 });

      expect(listenerStub.callCount).toEqual(1);
    });
  });

  describe('hasGeometry()', () => {
    it('Without geometry type as argument', () => {
      const feature1 = FeatureWrapper.create(new LineString([2, 2, 3, 3]));
      const feature2 = FeatureWrapper.create();
      expect(feature1.hasGeometry()).toBe(true);
      expect(feature2.hasGeometry()).toBe(false);
    });

    it('With geometry type as argument', () => {
      const feature1 = FeatureWrapper.create(new LineString([2, 2, 3, 3]));
      const feature2 = FeatureWrapper.create();
      expect(feature1.hasGeometry(AbcGeometryType.LINE_STRING)).toBe(true);
      expect(feature1.hasGeometry(AbcGeometryType.POLYGON)).toBe(false);
      expect(feature1.hasGeometry(AbcGeometryType.LINE_STRING, AbcGeometryType.POLYGON)).toBe(true);
      expect(feature2.hasGeometry(AbcGeometryType.POLYGON)).toBe(false);
    });
  });

  describe('toGeoJSON()', () => {
    it('With a geometry and properties', () => {
      const feature = FeatureWrapper.create(new LineString([2, 2, 3, 3]))
        .setId('ABCD1234')
        .setSelected(true)
        .setStyleProperties({ point: { icon: 'test-icon' } });

      expect(feature.toGeoJSON()).toEqual({
        id: 'ABCD1234',
        type: 'Feature',
        geometry: { coordinates: [], type: 'LineString' },
        properties: {
          'abc:feature:selected': true,
          'abc:style:point:icon': 'test-icon',
        },
      });
    });

    it('Without a geometry and properties', () => {
      const feature = FeatureWrapper.create().setId('ABCD1234');

      expect(feature.toGeoJSON()).toEqual({
        id: 'ABCD1234',
        type: 'Feature',
        geometry: null,
        properties: null,
      });
    });

    it('With non serializable properties', () => {
      const feature = FeatureWrapper.create().setId('ABCD1234');
      feature.unwrap().set('pop2023', 1234);
      feature.unwrap().set('some stange property', new Style());

      expect(feature.toGeoJSON()).toEqual({
        id: 'ABCD1234',
        type: 'Feature',
        geometry: null,
        properties: {
          pop2023: 1234,
        },
      });
    });
  });

  describe('setHighlighted()', () => {
    it('should work', () => {
      // Prepare
      const originalStyle = new Style();
      const feature = FeatureWrapper.from(TestHelper.sampleFeatures()[0]).setId();
      feature.unwrap().setStyle(originalStyle);

      expect(feature.isHighlighted()).toBe(false);
      expect(feature.unwrap().getStyle()).not.toBeNull();

      // Act & assert
      feature.setHighlighted(true);
      expect(feature.isHighlighted()).toBe(true);
      expect(feature.unwrap().getStyle()).toBeDefined();
      expect(feature.unwrap().getStyle()).not.toStrictEqual(originalStyle);

      feature.setHighlighted(false);
      expect(feature.isHighlighted()).toBe(false);
      expect(feature.unwrap().getStyle()).toStrictEqual(originalStyle);
      expect(feature.unwrap().get(HlStyleKey)).toBeUndefined();
      expect(feature.unwrap().get(HlPreviousStyleKey)).toBeUndefined();
    });

    it('should work even with bad calls', () => {
      // Prepare
      const originalStyle = new Style();
      const feature = FeatureWrapper.from(TestHelper.sampleFeatures()[0]).setId();
      feature.unwrap().setStyle(originalStyle);

      // Act & assert
      feature.setHighlighted(true);
      feature.setHighlighted(true);
      feature.setHighlighted(true);
      expect(feature.isHighlighted()).toBe(true);
      expect(feature.unwrap().getStyle()).toBeDefined();
      expect(feature.unwrap().getStyle()).not.toStrictEqual(originalStyle);

      feature.setHighlighted(false);
      feature.setHighlighted(false);
      feature.setHighlighted(false);
      expect(feature.isHighlighted()).toBe(false);
      expect(feature.unwrap().getStyle()).toStrictEqual(originalStyle);
      expect(feature.unwrap().get(HlStyleKey)).toBeUndefined();
      expect(feature.unwrap().get(HlPreviousStyleKey)).toBeUndefined();
    });
  });

  describe('toDataRow()', () => {
    it('with a feature that already has an id', () => {
      // Prepare
      const feature = FeatureWrapper.create();
      feature.setDataProperties({
        variable1: 'value1',
        variable2: 'value2',
      });
      expect(feature.getId()).toBeDefined();

      // Act & assert
      expect(feature.toDataRow()).toEqual({
        id: feature.getId(),
        data: {
          variable1: 'value1',
          variable2: 'value2',
        },
        metadata: { selected: false },
      });
    });

    it('with a feature that does not have an id', () => {
      // Prepare
      const feature = FeatureWrapper.create();
      feature.setDataProperties({
        variable1: 'value1',
        variable2: 'value2',
      });
      feature.setId(undefined);

      // Act & assert
      const row1 = feature.toDataRow();
      const row2 = feature.toDataRow();
      expect(row1.id).toBeDefined();
      expect(row1).toEqual(row2);
    });
  });
});
