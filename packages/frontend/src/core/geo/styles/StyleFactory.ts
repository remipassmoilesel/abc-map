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

import Style from 'ol/style/Style';
import { Fill, Icon, Stroke, Text } from 'ol/style';
import { DefaultStyle, FeatureStyle, GeometryType, Logger } from '@abc-map/shared';
import { SelectionStyleFactory } from './SelectionStyleFactory';
import { StyleCache, StyleCacheEntry } from './StyleCache';
import { FillPatternFactory } from './FillPatternFactory';
import { IconProcessor } from './IconProcessor';
import { DefaultIcon, safeGetIcon } from '../../../assets/point-icons/PointIcons';
import { PointIconName } from '../../../assets/point-icons/PointIconName';
import { FeatureWrapper } from '../features/FeatureWrapper';

const logger = Logger.get('StyleFactory.ts');

export class StyleFactory {
  private static instance: StyleFactory | undefined;

  public static get(): StyleFactory {
    if (!this.instance) {
      this.instance = new StyleFactory();
    }
    return this.instance;
  }

  private fillPattern = new FillPatternFactory();
  private selection = new SelectionStyleFactory();

  constructor(private cache = new StyleCache()) {}

  public getForFeature(feature: FeatureWrapper, ratio: number): Style[] {
    const type = feature.getGeometry()?.getType();
    if (!type) {
      return [];
    }

    const properties = feature.getStyleProperties();
    const style = this.getForProperties(properties, type, ratio);

    if (feature.isSelected()) {
      return [style, ...this.selection.getForFeature(feature)];
    }

    return [style];
  }

  public getForProperties(properties: FeatureStyle, type: GeometryType, ratio: number): Style {
    let style = this.cache.get(type, properties, ratio);
    if (!style) {
      style = this.createStyle(type, properties, ratio);
      this.cache.put(type, properties, ratio, style);
    }

    return style;
  }

  public getAvailableStyles(ratio: number): StyleCacheEntry[] {
    return this.cache
      .getAll()
      .filter((item) => item.ratio === ratio)
      .sort((a, b) => {
        // First we sort by geometry type
        const geomOrder = a.geomType.localeCompare(b.geomType);
        if (geomOrder !== 0) {
          return geomOrder;
        }

        // Then we sort points by size
        const pointSizeOrder = (a.properties.point?.size || 0) - (b.properties.point?.size || 0);
        if (pointSizeOrder !== 0) {
          return pointSizeOrder;
        }

        // Then we sort points by symbol
        const pointSymbolOrder = (a.properties.point?.icon || '').localeCompare(b.properties.point?.icon || '');
        if (pointSymbolOrder !== 0) {
          return pointSymbolOrder;
        }

        // Then we sort points by color
        const pointColorOrder = (a.properties.point?.color || '').localeCompare(b.properties.point?.color || '');
        if (pointColorOrder !== 0) {
          return pointColorOrder;
        }

        // Then we sort others by stroke color
        const stokeColorOrder = (a.properties.stroke?.color || '').localeCompare(b.properties.stroke?.color || '');
        if (stokeColorOrder !== 0) {
          return stokeColorOrder;
        }

        // Then we sort others by background color
        return (a.properties.fill?.color1 || '').localeCompare(b.properties.fill?.color1 || '');
      });
  }

  public clearCache() {
    this.cache.clear();
  }

  private createStyle(type: GeometryType, properties: FeatureStyle, ratio: number): Style {
    // Text can apply to all geometries
    let textStyle: Text | undefined;
    if (properties.text?.value) {
      textStyle = this.createText(properties, ratio);
    }

    // Points
    if (GeometryType.POINT === type || GeometryType.MULTI_POINT === type) {
      const size = (properties.point?.size || 10) * ratio;
      const name = (properties.point?.icon as PointIconName) || DefaultIcon;
      const color = properties.point?.color || '#000000';
      const icon = IconProcessor.get().prepareCached(safeGetIcon(name), size, color);
      // We must use "src" attribute here, as icons may not be loaded
      const pointStyle = new Icon({ src: icon, imgSize: [size, size] });
      return new Style({ image: pointStyle, text: textStyle, zIndex: properties.zIndex });
    }

    // Line strings
    else if (GeometryType.LINE_STRING === type || GeometryType.MULTI_LINE_STRING === type || GeometryType.LINEAR_RING === type) {
      const stroke = this.createStroke(properties, ratio);
      return new Style({ stroke, text: textStyle, zIndex: properties.zIndex });
    }

    // Others
    else {
      const fill = this.createFill(properties);
      const stroke = this.createStroke(properties, ratio);
      return new Style({ fill, stroke, text: textStyle, zIndex: properties.zIndex });
    }
  }

  private createText(properties: FeatureStyle, ratio: number): Text {
    const text = properties.text;
    const fontName = text?.font || DefaultStyle.text.font;
    const fontSize = (text?.size || DefaultStyle.text.size) * ratio;
    const font = `${fontSize}px ${fontName}`;
    const offsetX = (text?.offsetX ?? DefaultStyle.text.offsetX) * ratio;
    const offsetY = (text?.offsetY ?? DefaultStyle.text.offsetY) * ratio;
    return new Text({
      fill: new Fill({ color: text?.color || DefaultStyle.text?.color }),
      font,
      text: text?.value,
      offsetX,
      offsetY,
      textAlign: text?.alignment,
    });
  }

  private createStroke(properties: FeatureStyle, ratio: number): Stroke {
    return new Stroke({
      width: (properties.stroke?.width || DefaultStyle.stroke.width) * ratio,
      color: properties.stroke?.color || DefaultStyle.stroke?.color,
    });
  }

  private createFill(properties: FeatureStyle): Fill {
    if (properties.fill?.pattern) {
      const pattern = this.fillPattern.create(properties.fill) || properties.fill.color1 || DefaultStyle.fill?.color1;
      return new Fill({ color: pattern });
    } else {
      return new Fill({ color: properties.fill?.color1 || DefaultStyle.fill?.color1 });
    }
  }
}
