import { toleranceFromStyle } from './toleranceFromStyle';
import { FeatureWrapper } from '../../features/FeatureWrapper';
import Point from 'ol/geom/Point';

describe('toleranceFromStyle()', () => {
  it('should return correct value', () => {
    const feature = FeatureWrapper.create(new Point([1, 1]));
    feature.setStyleProperties({ point: { size: 8 }, stroke: { width: 6 } });
    expect(toleranceFromStyle(feature.unwrap(), 2)).toEqual(14);
  });
});
