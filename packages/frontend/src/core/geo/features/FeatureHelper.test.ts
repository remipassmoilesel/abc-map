import { FeatureHelper } from './FeatureHelper';
import Feature from 'ol/Feature';
import { FeatureProperties } from '@abc-map/shared-entities';

describe('FeatureHelper', () => {
  it('isSelected should work', () => {
    const feature = new Feature();
    feature.set(FeatureProperties.Selected, true);
    expect(FeatureHelper.isSelected(feature)).toBe(true);
    feature.set(FeatureProperties.Selected, false);
    expect(FeatureHelper.isSelected(feature)).toBe(false);
  });

  it('setSelected should work', () => {
    const feature = new Feature();
    FeatureHelper.setSelected(feature, true);
    expect(FeatureHelper.isSelected(feature)).toBe(true);
    FeatureHelper.setSelected(feature, false);
    expect(FeatureHelper.isSelected(feature)).toBe(false);
  });
});
