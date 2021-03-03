import { FeatureProperties, FillPatterns, StyleProperties } from '@abc-map/shared-entities';
import { Circle, Point } from 'ol/geom';
import { FeatureWrapper } from './FeatureWrapper';
import { DefaultStyle, FeatureStyle } from '../style/FeatureStyle';
import { TestHelper } from '../../utils/TestHelper';
import { Style } from 'ol/style';

describe('FeatureWrapper', () => {
  it('create()', () => {
    const feature = FeatureWrapper.create();
    expect(feature.unwrap().getId()).toBeDefined();
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
    it('setDefaultStyle()', () => {
      const original = TestHelper.sampleStyleProperties();
      original.fill = {
        color1: '#ccc',
      };
      const feature = FeatureWrapper.create(new Point([4, 5]));
      feature.setStyleProperties(original);
      expect(feature.getStyleProperties()).toEqual(original);
      expect((feature.unwrap().getStyle() as Style[])[0].getFill().getColor()).toEqual(original.fill?.color1);

      feature.setDefaultStyle();

      expect(feature.getStyleProperties()).toEqual(DefaultStyle);
      expect((feature.unwrap().getStyle() as Style[])[0].getFill().getColor()).toEqual(DefaultStyle.fill?.color1);
    });

    it('applyStyle()', () => {
      const feature = FeatureWrapper.create(new Point([4, 5]));
      expect(feature.unwrap().getStyle()).toBeNull();

      feature.applyStyle();

      expect(feature.unwrap().getStyle()).not.toBeNull();
    });

    it('setStyleProperties()', () => {
      const feature = FeatureWrapper.create();

      feature.setStyleProperties(TestHelper.sampleStyleProperties());

      const ol = feature.unwrap();
      expect(ol.get(StyleProperties.StrokeColor)).toEqual('black');
      expect(ol.get(StyleProperties.StrokeWidth)).toEqual(5);
      expect(ol.get(StyleProperties.FillColor1)).toEqual('white');
      expect(ol.get(StyleProperties.FillColor2)).toEqual('blue');
      expect(ol.get(StyleProperties.FillPattern)).toEqual(FillPatterns.HatchingObliqueLeft);
      expect(ol.get(StyleProperties.TextValue)).toEqual('Test text value');
      expect(ol.get(StyleProperties.TextColor)).toEqual('#00f');
      expect(ol.get(StyleProperties.TextSize)).toEqual(30);
      expect(ol.get(StyleProperties.TextFont)).toEqual('sans-serif');
      expect(ol.get(StyleProperties.TextOffsetX)).toEqual(20);
      expect(ol.get(StyleProperties.TextOffsetY)).toEqual(30);
    });

    it('setStyleProperties() should apply style', () => {
      const feature = FeatureWrapper.create();
      expect(feature.unwrap().getStyle()).toBeNull();

      feature.setStyleProperties(TestHelper.sampleStyleProperties());

      expect(feature.unwrap().getStyle()).not.toBeNull();
    });

    it('getStyleProperties()', () => {
      const feature = FeatureWrapper.create();
      feature.unwrap().set(StyleProperties.StrokeWidth, 5);
      feature.unwrap().set(StyleProperties.StrokeColor, 'black');
      feature.unwrap().set(StyleProperties.FillColor1, 'white');
      feature.unwrap().set(StyleProperties.FillColor2, 'blue');
      feature.unwrap().set(StyleProperties.FillPattern, FillPatterns.HatchingObliqueLeft);
      feature.unwrap().set(StyleProperties.TextValue, 'Test text value');
      feature.unwrap().set(StyleProperties.TextColor, '#00f');
      feature.unwrap().set(StyleProperties.TextSize, 30);
      feature.unwrap().set(StyleProperties.TextFont, 'sans-serif');
      feature.unwrap().set(StyleProperties.TextOffsetX, 20);
      feature.unwrap().set(StyleProperties.TextOffsetY, 30);
      feature.unwrap().set(StyleProperties.TextAlignment, 'left');
      feature.unwrap().set(StyleProperties.PointSize, 5);

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
      expect(feature.unwrap().get(StyleProperties.StrokeColor)).toEqual('black');
      expect(feature.unwrap().get(StyleProperties.FillColor1)).toEqual('white');
      expect(feature.unwrap().get(StyleProperties.FillColor2)).toEqual('blue');
      expect(feature.unwrap().get(StyleProperties.FillPattern)).toEqual(FillPatterns.HatchingObliqueLeft);
    });

    it('should apply style', () => {
      const feature = FeatureWrapper.create();
      expect(feature.unwrap().getStyle()).toBeNull();

      feature.setText('Sample text');

      expect(feature.unwrap().getStyle()).not.toBeNull();
    });
  });
});
