import { FeatureWrapper } from '../features/FeatureWrapper';
import { Point } from 'ol/geom';
import { TestHelper } from '../../utils/TestHelper';
import { StyleFunction } from 'ol/style/Style';
import { VectorStyles } from './VectorStyles';

describe('VectorStyles', () => {
  let func: StyleFunction;

  beforeEach(() => {
    func = VectorStyles.openLayersStyleFunction();
  });

  it('should return style', () => {
    const feature = FeatureWrapper.create(new Point([1, 2])).setStyle(TestHelper.sampleStyleProperties());

    const styles = func(feature.unwrap(), 1000);

    expect(styles).toHaveLength(1);
  });

  it('should add selection style for selected feature', () => {
    const feature = FeatureWrapper.create(new Point([1, 2]))
      .setStyle(TestHelper.sampleStyleProperties())
      .setSelected(true);

    const styles = func(feature.unwrap(), 1000);

    expect(styles).toHaveLength(2);
  });
});
