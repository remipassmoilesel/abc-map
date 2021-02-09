import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import { FeatureProperties } from '@abc-map/shared-entities';
import * as uuid from 'uuid';

// TODO: refactor: remove helpers, use thin wrappers

export class FeatureHelper {
  public static generateId(): string {
    return uuid.v4();
  }

  /**
   * Set id of feature if specified, or generate one
   * @param feature
   * @param id
   */
  public static setId(feature: Feature<Geometry>, id?: string): void {
    feature.setId(id || this.generateId());
  }

  /**
   * Clone feature, including its id
   * @param feature
   */
  public static clone(feature: Feature<Geometry>): Feature<Geometry> {
    const clone = feature.clone();
    clone.setId(feature.getId());
    return clone;
  }

  public static isSelected(feature: Feature<Geometry>): boolean {
    return !!feature.get(FeatureProperties.Selected);
  }

  public static setSelected(feature: Feature<Geometry>, value: boolean): void {
    feature.set(FeatureProperties.Selected, value);
  }
}
