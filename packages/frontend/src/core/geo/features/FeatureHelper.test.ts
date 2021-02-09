import { FeatureHelper } from './FeatureHelper';
import Feature from 'ol/Feature';
import { FeatureProperties } from '@abc-map/shared-entities';
import { Circle } from 'ol/geom';
import * as uuid from 'uuid';

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

  it('clone() should work', () => {
    const feature = new Feature();
    feature.setId(uuid.v4());
    const geom = new Circle([5, 5]);
    feature.setGeometry(geom);

    const clone = FeatureHelper.clone(feature);

    expect(clone.getId()).toEqual(feature.getId());
    expect(clone).not.toStrictEqual(feature);
    expect(FeatureHelper.isSelected(clone)).toEqual(FeatureHelper.isSelected(feature));
    expect(clone.getGeometry()?.getExtent()).toEqual(feature.getGeometry()?.getExtent());
    expect(clone.getGeometry()).not.toStrictEqual(feature.getGeometry());
  });
});
