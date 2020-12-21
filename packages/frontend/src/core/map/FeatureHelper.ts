import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import { FeatureProperties } from '@abc-map/shared-entities';

export class FeatureHelper {
  public static isSelected(feature: Feature<Geometry>): boolean {
    return !!feature.get(FeatureProperties.Selected);
  }

  public static setSelected(feature: Feature<Geometry>, value: boolean): void {
    feature.set(FeatureProperties.Selected, value);
  }
}
