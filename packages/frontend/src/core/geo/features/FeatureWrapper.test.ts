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

  it('getStyle()', () => {
    const feature = FeatureWrapper.create();
    feature.unwrap().set(StyleProperties.StrokeWidth, 5);
    feature.unwrap().set(StyleProperties.StrokeColor, 'black');
    feature.unwrap().set(StyleProperties.FillColor1, 'white');
    feature.unwrap().set(StyleProperties.FillColor2, 'blue');
    feature.unwrap().set(StyleProperties.FillPattern, FillPatterns.HatchingObliqueLeft);

    const properties = feature.getStyle();

    const expected: AbcStyleProperties = TestHelper.sampleStyleProperties();
    expect(properties).toEqual(expected);
  });

  it('setProperties()', () => {
    const feature = FeatureWrapper.create();
    const style: AbcStyleProperties = TestHelper.sampleStyleProperties();

    feature.setStyle(style);

    expect(feature.unwrap().get(StyleProperties.StrokeWidth)).toEqual(5);
    expect(feature.unwrap().get(StyleProperties.StrokeColor)).toEqual('black');
    expect(feature.unwrap().get(StyleProperties.FillColor1)).toEqual('white');
    expect(feature.unwrap().get(StyleProperties.FillColor2)).toEqual('blue');
    expect(feature.unwrap().get(StyleProperties.FillPattern)).toEqual(FillPatterns.HatchingObliqueLeft);
  });
});
