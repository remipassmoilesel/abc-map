import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import { Circle, Fill, Stroke, Text } from 'ol/style';
import { Logger } from '../../utils/Logger';
import { FeatureStyle, DefaultStyle } from './FeatureStyle';
import { SelectionStyleFactory } from './SelectionStyleFactory';
import { StyleCache } from './StyleCache';
import { FillPatternFactory } from './FillPatternFactory';
import Geometry from 'ol/geom/Geometry';
import GeometryType from 'ol/geom/GeometryType';

const logger = Logger.get('VectorStyles.ts');

export class StyleFactory {
  private fillPattern = new FillPatternFactory();
  private selection = new SelectionStyleFactory();

  constructor(private cache = new StyleCache()) {}

  public getFor(feature: Feature<Geometry>, properties: FeatureStyle, selected: boolean): Style[] {
    const type = feature.getGeometry()?.getType();
    if (!type) {
      return [];
    }

    let style = this.cache.get(type, properties);
    if (!style) {
      style = this.createStyle(type, properties);
      this.cache.put(type, properties, style);
    }

    if (selected) {
      return [...style, ...this.selection.getForFeature(feature)];
    }

    return style;
  }

  private createStyle(type: GeometryType, properties: FeatureStyle): Style[] {
    // Text can apply to all geometries
    let textStyle: Text | undefined;
    if (properties.text?.value) {
      textStyle = this.createText(properties);
    }

    // Points
    if (GeometryType.POINT === type) {
      const fill = this.createFill(properties);
      const stroke = this.createStroke(properties);
      let pointStyle: Circle | undefined;
      if (properties.point?.size) {
        pointStyle = new Circle({
          fill: fill,
          stroke: stroke,
          radius: properties.point?.size,
        });
      }
      return [new Style({ fill, stroke, image: pointStyle, text: textStyle })];
    }

    // Line strings
    else if (GeometryType.LINE_STRING === type) {
      const stroke = this.createStroke(properties);
      return [new Style({ stroke, text: textStyle })];
    }

    // Others
    else {
      const fill = this.createFill(properties);
      const stroke = this.createStroke(properties);
      return [new Style({ fill, stroke, text: textStyle })];
    }
  }

  private createText(properties: FeatureStyle): Text {
    const text = properties.text;
    const fontName = text?.font || DefaultStyle.text?.font;
    const fontSize = text?.size || DefaultStyle.text?.size;
    const font = `${fontSize}px ${fontName}`;
    return new Text({
      fill: new Fill({ color: text?.color || DefaultStyle.text?.color }),
      font,
      text: text?.value,
      offsetX: text?.offsetX,
      offsetY: text?.offsetY,
      textAlign: text?.alignment,
    });
  }

  private createStroke(properties: FeatureStyle): Stroke {
    return new Stroke({
      width: properties.stroke?.width || DefaultStyle.stroke?.width,
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
