import Feature, { FeatureLike } from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import uuid from 'uuid-random';
import { FeatureProperties, StyleProperties } from '@abc-map/shared-entities';
import { AbcStyleProperties } from '../style/AbcStyleProperties';

/**
 * This class is a thin wrapper around Openlayers features, used to ensure that critical operations
 * on features are well done
 */
export class FeatureWrapper {
  public static create(geom?: Geometry): FeatureWrapper {
    return new FeatureWrapper(new Feature<Geometry>(geom)).setId();
  }

  public static from(ol: Feature<Geometry>): FeatureWrapper {
    return new FeatureWrapper(ol);
  }

  public static fromFeatureLike(ol: FeatureLike): FeatureWrapper | undefined {
    const isFeature = ol instanceof Feature;
    const hasGeometry = ol.getGeometry() instanceof Geometry;
    const hasId = !!ol.getId();
    if (isFeature && hasGeometry && hasId) {
      return FeatureWrapper.from(ol as Feature<Geometry>);
    }
  }

  constructor(private feature: Feature<Geometry>) {}

  public unwrap(): Feature<Geometry> {
    return this.feature;
  }

  /**
   * Set id of feature if specified, or generate one
   *
   * UUID is overkill for features, we must find another solution
   *
   * @param id
   */
  public setId(id?: string | number): FeatureWrapper {
    this.feature.setId(id || uuid());
    return this;
  }

  public getId(): string | number | undefined {
    return this.feature.getId();
  }

  /**
   * Clone feature, including its id
   */
  public clone(): FeatureWrapper {
    const clone = this.feature.clone();
    clone.setId(this.feature.getId());
    return FeatureWrapper.from(clone);
  }

  public isSelected(): boolean {
    return !!this.feature.get(FeatureProperties.Selected);
  }

  public setSelected(value: boolean): FeatureWrapper {
    this.feature.set(FeatureProperties.Selected, value);
    return this;
  }

  /**
   * Extract style properties from feature
   */
  public getStyle(): AbcStyleProperties {
    return {
      stroke: {
        color: this.feature.get(StyleProperties.StrokeColor),
        width: this.feature.get(StyleProperties.StrokeWidth),
      },
      fill: {
        color1: this.feature.get(StyleProperties.FillColor1),
        color2: this.feature.get(StyleProperties.FillColor2),
        pattern: this.feature.get(StyleProperties.FillPattern),
      },
    };
  }

  /**
   * Set style properties on feature
   * @param style
   */
  public setStyle(style: AbcStyleProperties): FeatureWrapper {
    this.feature.set(StyleProperties.StrokeColor, style.stroke.color);
    this.feature.set(StyleProperties.StrokeWidth, style.stroke.width);
    this.feature.set(StyleProperties.FillColor1, style.fill.color1);
    this.feature.set(StyleProperties.FillColor2, style.fill.color2);
    this.feature.set(StyleProperties.FillPattern, style.fill.pattern);
    return this;
  }

  public getGeometry(): Geometry | undefined {
    return this.feature.getGeometry();
  }
}