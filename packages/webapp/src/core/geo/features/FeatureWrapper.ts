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

import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { AbcGeometryType, DefaultStyle, FeatureProperties, FeatureStyle, Logger, StyleProperties } from '@abc-map/shared';
import { nanoid } from 'nanoid';
import { OlGeometry } from './OlGeometry';
import { isOpenlayersFeature } from '../../utils/crossContextInstanceof';
import { GeoJSON } from 'ol/format';
import { Projection } from 'ol/proj';
import { GeoJSONFeature } from 'ol/format/GeoJSON';
import { DataRow } from '../../data/data-source/DataSource';
import { isValidDataField } from './isValidDataField';
import { HighlightedStyleFactory } from '../styles/HighlightedStyleFactory';

const logger = Logger.get('FeatureWrapper.ts');

export function disableFeatureWrapperLogging() {
  logger.disable();
}

export declare type OlPropertiesMap = { [key: string]: any };

export declare type DataPropertiesMap = { [key: string]: string | boolean | number | undefined | null };

const geoJson = new GeoJSON();

const highLightStyleFactory = new HighlightedStyleFactory();

export const HlPreviousStyleKey = 'abc:highlight:previous-style';
export const HlStyleKey = 'abc:highlight:highlight-style';

export type SupportedFeature<T extends OlGeometry = OlGeometry> = FeatureWrapper | Feature<T>;

/**
 * This class is a thin wrapper around Openlayers features, used to ensure that critical operations
 * on features are well done
 */
export class FeatureWrapper<Geom extends OlGeometry = OlGeometry> {
  public static create(geom?: Geometry): FeatureWrapper {
    return new FeatureWrapper(new Feature<Geometry>(geom)).setId();
  }

  public static from<T extends OlGeometry = OlGeometry>(feature: SupportedFeature): FeatureWrapper<T> {
    // If feature is already wrapped, we return it
    if (isFeatureWrapper(feature)) {
      return feature as FeatureWrapper<T>;
    }

    if (!isOpenlayersFeature(feature)) {
      throw new Error(`Invalid feature: ${feature ?? 'undefined'}`);
    }

    return new FeatureWrapper<T>(feature as Feature<T>);
  }

  public static fromUnknown<T extends OlGeometry = OlGeometry>(feature: unknown): FeatureWrapper<T> | undefined {
    // If feature is already wrapped, we return it
    if (isFeatureWrapper(feature)) {
      return feature as FeatureWrapper<T>;
    }

    // This is not an Openlayer feature, we can not process it
    if (!isOpenlayersFeature(feature)) {
      return;
    }

    return FeatureWrapper.from(feature as Feature<T>);
  }

  public static fromGeoJSON(feature: GeoJSONFeature, dataProjection?: Projection | string): FeatureWrapper {
    return FeatureWrapper.from(geoJson.readFeature(feature, { dataProjection }));
  }

  constructor(private feature: Feature<Geom>) {}

  public unwrap(): Feature<Geom> {
    return this.feature;
  }

  /**
   * Set id of feature if specified, or generate one
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

  /**
   * WARNING: You should probably use FeatureSelection class instead.
   * @param value
   */
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
        rotation: this.feature.get(StyleProperties.TextRotation),
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
   * Set style properties on feature.
   *
   * Properties are set only if they are defined.
   *
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
    setIfDefined(StyleProperties.TextRotation, properties.text?.rotation);
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
      case AbcGeometryType.POLYGON:
      case AbcGeometryType.MULTI_POLYGON:
      case AbcGeometryType.CIRCLE:
      case AbcGeometryType.GEOMETRY_COLLECTION:
        this.setStyleProperties({ fill: DefaultStyle.fill, stroke: DefaultStyle.stroke });
        break;
      case AbcGeometryType.POINT:
      case AbcGeometryType.MULTI_POINT:
        this.setStyleProperties({ point: DefaultStyle.point });
        break;
      case AbcGeometryType.LINE_STRING:
      case AbcGeometryType.MULTI_LINE_STRING:
      case AbcGeometryType.LINEAR_RING:
        this.setStyleProperties({ stroke: DefaultStyle.stroke });
        break;
    }

    if (this.getText()) {
      this.setStyleProperties({ text: DefaultStyle.text });
    }

    return this;
  }

  public getGeometry(): Geom | undefined {
    return this.feature.getGeometry();
  }

  /**
   * If you do not specify geometry types, returns true if there is a geometry attached.
   *
   * If you do specify geometry types, returns true if there is a geometry with specified type, false otherwise.
   *
   * @param geoms
   */
  public hasGeometry(...geoms: AbcGeometryType[]): boolean {
    if (!geoms.length) {
      return !!this.getGeometry();
    }

    const type = this.getGeometry()?.getType();
    return !!geoms.find((t) => t === type);
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

  public getAllProperties(): OlPropertiesMap {
    return this.feature.getProperties();
  }

  /**
   * Return properties of feature:
   * - that are not internal
   * - that are numbers or strings
   */
  public getDataProperties(): DataPropertiesMap {
    const result: DataPropertiesMap = {};
    const properties = this.feature.getProperties();

    for (const key in properties) {
      const property = properties[key];
      const typeIsCorrect = isValidDataField(property);
      const notAbcProperty = key.indexOf('abc:') === -1;
      if (typeIsCorrect && notAbcProperty) {
        result[key] = property;
      }
    }

    return result;
  }

  public setProperties(properties: DataPropertiesMap): FeatureWrapper {
    this.feature.setProperties(properties);
    return this;
  }

  /**
   * Overwrite all data properties.
   *
   * @param properties
   */
  public setDataProperties(properties: DataPropertiesMap): FeatureWrapper {
    const original = this.getDataProperties();
    const propertyKeys = Object.keys(properties);

    // First we remove properties
    const toRemove = Object.keys(original).filter((k) => !propertyKeys.find((k2) => k === k2));
    toRemove.forEach((k) => this.feature.unset(k));

    // Then we set and trigger change
    this.feature.setProperties(properties);
    return this;
  }

  public toGeoJSON(dataProjection?: Projection | string): GeoJSONFeature {
    const clone = this.clone();
    const data = clone.getAllProperties();

    // We must delete non serializable properties
    for (const key in data) {
      const field = data[key];

      if (key !== 'geometry' && !isValidDataField(field)) {
        clone.unwrap().unset(key);
      }
    }

    return geoJson.writeFeatureObject(clone.unwrap(), { dataProjection });
  }

  public toDataRow(): DataRow {
    let id = this.getId();
    if (!id) {
      logger.warn('Feature does not have an id, we generate a new one');
      this.setId();
      id = this.getId();
      if (!id) {
        throw new Error('Invalid id');
      }
    }

    return {
      id,
      metadata: {
        selected: this.isSelected(),
      },
      data: this.getDataProperties(),
    };
  }

  public isHighlighted(): boolean {
    return !!this.feature.get(HlStyleKey);
  }

  public setHighlighted(value: boolean, timeoutMs = -1): void {
    if (this.isHighlighted() === value) {
      return;
    }

    if (value) {
      this.feature.set(HlPreviousStyleKey, this.feature.getStyle());

      const style = highLightStyleFactory.getForGeometry(this.getGeometry(), this.getStyleProperties());
      this.feature.setStyle(style);

      this.feature.set(HlStyleKey, style);

      if (timeoutMs > 0) {
        setTimeout(() => this.setHighlighted(false), timeoutMs);
      }
    } else {
      const previousStyle = this.feature.get(HlPreviousStyleKey);
      this.feature.setStyle(previousStyle);

      this.feature.unset(HlPreviousStyleKey);
      this.feature.unset(HlStyleKey);
    }
  }

  /**
   * This function helps to identify a FeatureWrapper, even in case of cross context objects.
   *
   * In most cases instanceof may work, but not for modules.
   */
  public isFeatureWrapper(): this is FeatureWrapper<Geom> {
    return true;
  }
}

export function isFeatureWrapper(feature: unknown) {
  return (
    !!feature && typeof feature === 'object' && 'isFeatureWrapper' in feature && typeof feature.isFeatureWrapper === 'function' && feature.isFeatureWrapper()
  );
}
