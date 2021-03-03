import Feature, { FeatureLike } from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import uuid from 'uuid-random';
import { FeatureProperties, StyleProperties } from '@abc-map/shared-entities';
import { FeatureStyle, DefaultStyle } from '../style/FeatureStyle';
import { StyleFactory } from '../style/StyleFactory';

const styles = new StyleFactory();

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
    this.applyStyle();
    return this;
  }

  /**
   * Extract style properties from feature
   */
  public getStyleProperties(): FeatureStyle {
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
      text: {
        value: this.feature.get(StyleProperties.TextValue),
        color: this.feature.get(StyleProperties.TextColor),
        size: this.feature.get(StyleProperties.TextSize),
        font: this.feature.get(StyleProperties.TextFont),
        offsetX: this.feature.get(StyleProperties.TextOffsetX),
        offsetY: this.feature.get(StyleProperties.TextOffsetY),
        alignment: this.feature.get(StyleProperties.TextAlignment),
      },
      point: {
        size: this.feature.get(StyleProperties.PointSize),
      },
    };
  }

  /**
   * Set style properties on feature
   * @param properties
   */
  public setStyleProperties(properties: FeatureStyle): FeatureWrapper {
    this.feature.set(StyleProperties.StrokeColor, properties.stroke?.color);
    this.feature.set(StyleProperties.StrokeWidth, properties.stroke?.width);
    this.feature.set(StyleProperties.FillColor1, properties.fill?.color1);
    this.feature.set(StyleProperties.FillColor2, properties.fill?.color2);
    this.feature.set(StyleProperties.FillPattern, properties.fill?.pattern);
    this.feature.set(StyleProperties.TextValue, properties.text?.value);
    this.feature.set(StyleProperties.TextColor, properties.text?.color);
    this.feature.set(StyleProperties.TextSize, properties.text?.size);
    this.feature.set(StyleProperties.TextFont, properties.text?.font);
    this.feature.set(StyleProperties.TextOffsetX, properties.text?.offsetX);
    this.feature.set(StyleProperties.TextOffsetY, properties.text?.offsetY);
    this.feature.set(StyleProperties.TextAlignment, properties.text?.alignment);
    this.feature.set(StyleProperties.PointSize, properties.point?.size);

    this.applyStyle();

    return this;
  }

  public setDefaultStyle(): FeatureWrapper {
    this.setStyleProperties(DefaultStyle);
    this.applyStyle();
    return this;
  }

  public applyStyle(): FeatureWrapper {
    const properties = this.getStyleProperties();
    const style = styles.getFor(this.feature, properties, this.isSelected());
    this.feature.setStyle(style);
    return this;
  }

  public getGeometry(): Geometry | undefined {
    return this.feature.getGeometry();
  }

  public setText(text: string): FeatureWrapper {
    const style = this.getStyleProperties();
    this.setStyleProperties({
      ...style,
      text: {
        ...style.text,
        value: text,
      },
    });
    this.applyStyle();
    return this;
  }

  public getText(): string | undefined {
    return this.getStyleProperties().text?.value;
  }
}
