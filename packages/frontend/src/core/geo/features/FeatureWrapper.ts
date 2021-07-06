/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import Feature, { FeatureLike } from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { FeatureProperties, StyleProperties } from '@abc-map/shared';
import { FeatureStyle, DefaultStyle } from '@abc-map/shared';
import { nanoid } from 'nanoid';
import GeometryType from 'ol/geom/GeometryType';
import { Point, Circle, GeometryCollection, LinearRing, LineString, MultiLineString, MultiPoint, MultiPolygon, Polygon } from 'ol/geom';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('FeatureWrapper.ts');

export declare type PropertiesMap = { [key: string]: any };
export declare type SimplePropertiesMap = { [key: string]: string | number | undefined };
export declare type OlGeometry =
  | Geometry
  | Point
  | LineString
  | LinearRing
  | Polygon
  | MultiPoint
  | MultiLineString
  | MultiPolygon
  | GeometryCollection
  | Circle;

/**
 * This class is a thin wrapper around Openlayers features, used to ensure that critical operations
 * on features are well done
 */
export class FeatureWrapper<Geom extends OlGeometry = OlGeometry> {
  public static create(geom?: Geometry): FeatureWrapper {
    return new FeatureWrapper(new Feature<Geometry>(geom)).setId();
  }

  public static from<T extends OlGeometry = OlGeometry>(ol: Feature<T>): FeatureWrapper<T> {
    return new FeatureWrapper<T>(ol);
  }

  public static fromFeatureLike(ol: FeatureLike): FeatureWrapper | undefined {
    const isFeature = ol instanceof Feature;
    const hasGeometry = ol.getGeometry() instanceof Geometry;
    const hasId = !!ol.getId();
    if (isFeature && hasGeometry && hasId) {
      return FeatureWrapper.from(ol as Feature<Geometry>);
    }
  }

  constructor(private feature: Feature<Geom>) {}

  public unwrap(): Feature<Geom> {
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
    this.feature.setId(id ?? nanoid(10));
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
        icon: this.feature.get(StyleProperties.PointIcon),
        size: this.feature.get(StyleProperties.PointSize),
        color: this.feature.get(StyleProperties.PointColor),
      },
      zIndex: this.feature.get(StyleProperties.ZIndex),
    };
  }

  /**
   * Set style properties on feature
   * @param properties
   */
  public setStyleProperties(properties: FeatureStyle): FeatureWrapper {
    const setIfDefined = (name: string, value: string | number | undefined) => {
      if (typeof value !== 'undefined') {
        this.feature.set(name, value);
      }
    };

    setIfDefined(StyleProperties.StrokeColor, properties.stroke?.color);
    setIfDefined(StyleProperties.StrokeWidth, properties.stroke?.width);
    setIfDefined(StyleProperties.FillColor1, properties.fill?.color1);
    setIfDefined(StyleProperties.FillColor2, properties.fill?.color2);
    setIfDefined(StyleProperties.FillPattern, properties.fill?.pattern);
    setIfDefined(StyleProperties.TextValue, properties.text?.value);
    setIfDefined(StyleProperties.TextColor, properties.text?.color);
    setIfDefined(StyleProperties.TextSize, properties.text?.size);
    setIfDefined(StyleProperties.TextFont, properties.text?.font);
    setIfDefined(StyleProperties.TextOffsetX, properties.text?.offsetX);
    setIfDefined(StyleProperties.TextOffsetY, properties.text?.offsetY);
    setIfDefined(StyleProperties.TextAlignment, properties.text?.alignment);
    setIfDefined(StyleProperties.PointIcon, properties.point?.icon);
    setIfDefined(StyleProperties.PointSize, properties.point?.size);
    setIfDefined(StyleProperties.PointColor, properties.point?.color);
    setIfDefined(StyleProperties.ZIndex, properties.zIndex);

    return this;
  }

  public setDefaultStyle(): FeatureWrapper {
    const geom = this.getGeometry();
    if (!geom) {
      return this;
    }

    switch (geom.getType()) {
      case GeometryType.POLYGON:
      case GeometryType.MULTI_POLYGON:
      case GeometryType.CIRCLE:
      case GeometryType.GEOMETRY_COLLECTION:
        this.setStyleProperties({ fill: DefaultStyle.fill, stroke: DefaultStyle.stroke });
        break;
      case GeometryType.POINT:
      case GeometryType.MULTI_POINT:
        this.setStyleProperties({ point: DefaultStyle.point });
        break;
      case GeometryType.LINE_STRING:
      case GeometryType.MULTI_LINE_STRING:
      case GeometryType.LINEAR_RING:
        this.setStyleProperties({ stroke: DefaultStyle.stroke });
        break;
    }

    return this;
  }

  public getGeometry(): Geom | undefined {
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
    return this;
  }

  public getText(): string | undefined {
    return this.getStyleProperties().text?.value;
  }

  public getAllProperties(): PropertiesMap {
    return this.feature.getProperties();
  }

  /**
   * Return properties of feature:
   * - that are not internal
   * - that are numbers or strings
   */
  public getSimpleProperties(): SimplePropertiesMap {
    const result: SimplePropertiesMap = {};
    const properties = this.feature.getProperties();

    for (const key in properties) {
      const property = properties[key];
      const typeIsCorrect = typeof property === 'string' || typeof property === 'number';
      const notAbcProperty = key.indexOf('abc:') === -1;
      if (typeIsCorrect && notAbcProperty) {
        result[key] = property;
      }
    }

    return result;
  }

  public setProperties(properties: SimplePropertiesMap): FeatureWrapper {
    this.feature.setProperties(properties);
    return this;
  }

  public overwriteSimpleProperties(properties: SimplePropertiesMap): FeatureWrapper {
    const original = this.getSimpleProperties();
    const propertyKeys = Object.keys(properties);

    // First we remove properties
    const toRemove = Object.keys(original).filter((k) => !propertyKeys.find((k2) => k === k2));
    toRemove.forEach((k) => this.feature.unset(k));

    // Then we set
    this.feature.setProperties(properties);
    return this;
  }
}
