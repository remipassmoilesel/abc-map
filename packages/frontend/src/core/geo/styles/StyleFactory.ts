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
import Style from 'ol/style/Style';
import { Fill, Icon, Stroke, Text } from 'ol/style';
import { Logger } from '@abc-map/shared';
import { DefaultStyle, FeatureStyle } from './FeatureStyle';
import { SelectionStyleFactory } from './SelectionStyleFactory';
import { StyleCache } from './StyleCache';
import { FillPatternFactory } from './FillPatternFactory';
import Geometry from 'ol/geom/Geometry';
import GeometryType from 'ol/geom/GeometryType';
import { IconProcessor } from './IconProcessor';
import { safeGetIcon } from './PointIcons';
import { PointIcons } from '@abc-map/shared';

const logger = Logger.get('StyleFactory.ts');

export class StyleFactory {
  private fillPattern = new FillPatternFactory();
  private selection = new SelectionStyleFactory();

  constructor(private cache = new StyleCache()) {}

  public getFor(feature: Feature<Geometry>, properties: FeatureStyle, selected: boolean, ratio: number): Style[] {
    const type = feature.getGeometry()?.getType();
    if (!type) {
      return [];
    }

    let style = this.cache.get(type, properties, ratio);
    if (!style) {
      style = this.createStyle(type, properties, ratio);
      this.cache.put(type, properties, ratio, style);
    }

    if (selected) {
      return [...style, ...this.selection.getForFeature(feature)];
    }

    return style;
  }

  private createStyle(type: GeometryType, properties: FeatureStyle, ratio: number): Style[] {
    // Text can apply to all geometries
    let textStyle: Text | undefined;
    if (properties.text?.value) {
      textStyle = this.createText(properties, ratio);
    }

    // Points
    if (GeometryType.POINT === type || GeometryType.MULTI_POINT === type) {
      const size = (properties.point?.size || 10) * ratio;
      const name = (properties.point?.icon as PointIcons) || PointIcons.Square;
      const color = properties.point?.color || '#000000';
      const icon = IconProcessor.prepare(safeGetIcon(name), size, color);
      // We must use "src" attribute here, as icons may not be loaded
      const pointStyle = new Icon({ src: icon, imgSize: [size, size] });
      return [new Style({ image: pointStyle, text: textStyle, zIndex: properties.zIndex })];
    }

    // Line strings
    else if (GeometryType.LINE_STRING === type || GeometryType.MULTI_LINE_STRING === type || GeometryType.LINEAR_RING === type) {
      const stroke = this.createStroke(properties, ratio);
      return [new Style({ stroke, text: textStyle, zIndex: properties.zIndex })];
    }

    // Others
    else {
      const fill = this.createFill(properties);
      const stroke = this.createStroke(properties, ratio);
      return [new Style({ fill, stroke, text: textStyle, zIndex: properties.zIndex })];
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
