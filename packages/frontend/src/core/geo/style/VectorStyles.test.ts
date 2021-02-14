import Feature from 'ol/Feature';
import { FillPatterns, StyleProperties } from '@abc-map/shared-entities';
import { VectorStyles } from './VectorStyles';
import { AbcStyleProperties } from './AbcStyleProperties';
import { TestHelper } from '../../utils/TestHelper';

describe('VectorStyles.ts', () => {
  it('getProperties()', () => {
    const feature = new Feature();
    feature.set(StyleProperties.StrokeWidth, 5);
    feature.set(StyleProperties.StrokeColor, 'black');
    feature.set(StyleProperties.FillColor1, 'white');
    feature.set(StyleProperties.FillColor2, 'blue');
    feature.set(StyleProperties.FillPattern, FillPatterns.HatchingObliqueLeft);

    const properties = VectorStyles.getProperties(feature);

    const expected: AbcStyleProperties = TestHelper.sampleStyleProperties();
    expect(properties).toEqual(expected);
  });

  it('setProperties()', () => {
    const feature = new Feature();
    const style: AbcStyleProperties = TestHelper.sampleStyleProperties();

    VectorStyles.setProperties(feature, style);

    expect(feature.get(StyleProperties.StrokeWidth)).toEqual(5);
    expect(feature.get(StyleProperties.StrokeColor)).toEqual('black');
    expect(feature.get(StyleProperties.FillColor1)).toEqual('white');
  });
});
