import Feature from 'ol/Feature';
import { StyleProperties } from '@abc-map/shared-entities';
import { VectorStyles } from './VectorStyles';
import { AbcStyle } from './AbcStyle';

describe('VectorStyles.ts', () => {
  it('getProperties()', () => {
    const feature = new Feature();
    feature.set(StyleProperties.StrokeWidth, 5);
    feature.set(StyleProperties.StrokeColor, 'black');
    feature.set(StyleProperties.FillColor, 'white');
    const properties = VectorStyles.getProperties(feature);
    const expected: AbcStyle = {
      stroke: {
        width: 5,
        color: 'black',
      },
      fill: {
        color: 'white',
      },
    };
    expect(properties).toEqual(expected);
  });
});
