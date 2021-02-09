import Feature from 'ol/Feature';
import { StyleProperties } from '@abc-map/shared-entities';
import { VectorStyles } from './VectorStyles';
import { AbcStyle } from './AbcStyle';
import { TestHelper } from '../../utils/TestHelper';

describe('VectorStyles.ts', () => {
  it('getProperties()', () => {
    const feature = new Feature();
    feature.set(StyleProperties.StrokeWidth, 5);
    feature.set(StyleProperties.StrokeColor, 'black');
    feature.set(StyleProperties.FillColor, 'white');
    const properties = VectorStyles.getProperties(feature);
    const expected: AbcStyle = TestHelper.sampleStyleProperties();
    expect(properties).toEqual(expected);
  });

  it('setProperties()', () => {
    const feature = new Feature();
    const style: AbcStyle = TestHelper.sampleStyleProperties();
    VectorStyles.setProperties(feature, style);

    expect(feature.get(StyleProperties.StrokeWidth)).toEqual(5);
    expect(feature.get(StyleProperties.StrokeColor)).toEqual('black');
    expect(feature.get(StyleProperties.FillColor)).toEqual('white');
  });
});
