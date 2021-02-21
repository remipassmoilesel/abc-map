import { FeatureProperties, FillPatterns, StyleProperties } from '@abc-map/shared-entities';
import { Circle } from 'ol/geom';
import { FeatureWrapper } from './FeatureWrapper';
import { AbcStyleProperties } from '../style/AbcStyleProperties';
import { TestHelper } from '../../utils/TestHelper';

describe('FeatureWrapper', () => {
  it('create()', () => {
    const feature = FeatureWrapper.create();
    expect(feature.unwrap().getId()).toBeDefined();
  });

  it('setSelected()', () => {
    const feature = FeatureWrapper.create();
    feature.setSelected(true);
    expect(feature.unwrap().get(FeatureProperties.Selected)).toBe(true);
    expect(feature.isSelected()).toBe(true);
  });

  it('isSelected()', () => {
    const feature = FeatureWrapper.create();
    feature.setSelected(true);
    expect(feature.isSelected()).toBe(true);
  });

  it('isSelected()', () => {
    const feature = FeatureWrapper.create();
    feature.unwrap().set(FeatureProperties.Selected, undefined);
    expect(feature.isSelected()).toBe(false);
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

  it('setStyle()', () => {
    const feature = FeatureWrapper.create();
    feature.setStyle(TestHelper.sampleStyleProperties());

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

  it('getStyle()', () => {
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

    const properties = feature.getStyle();

    const expected: AbcStyleProperties = TestHelper.sampleStyleProperties();
    expect(properties).toEqual(expected);
  });

  it('setText()', () => {
    const feature = FeatureWrapper.create();
    feature.setStyle(TestHelper.sampleStyleProperties());
    feature.setText('Sample text');

    expect(feature.unwrap().get(StyleProperties.StrokeWidth)).toEqual(5);
    expect(feature.unwrap().get(StyleProperties.StrokeColor)).toEqual('black');
    expect(feature.unwrap().get(StyleProperties.FillColor1)).toEqual('white');
    expect(feature.unwrap().get(StyleProperties.FillColor2)).toEqual('blue');
    expect(feature.unwrap().get(StyleProperties.FillPattern)).toEqual(FillPatterns.HatchingObliqueLeft);
  });
});
