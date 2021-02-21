import { FeatureLike } from 'ol/Feature';
import Style, { StyleFunction } from 'ol/style/Style';
import { Circle, Fill, Stroke, Text } from 'ol/style';
import { FillPatterns } from '@abc-map/shared-entities';
import { Logger } from '../../utils/Logger';
import { AbcStyleProperties } from './AbcStyleProperties';
import { SelectionStyle } from './SelectionStyle';
import { StyleCache } from './StyleCache';
import { FillPatternFactory } from './FillPatternFactory';
import { FeatureWrapper } from '../features/FeatureWrapper';

const logger = Logger.get('VectorStyles.ts');

const defaults = {
  stroke: {
    color: '#000',
    width: 2,
  },
  fill: {
    color1: '#fff',
    color2: '#00f',
    pattern: FillPatterns.HatchingVertical,
  },
  text: {
    color: '#00f',
    font: 'sans-serif',
    size: 600,
  },
};

export class VectorStyles {
  public static createStyle(properties: AbcStyleProperties): Style[] {
    let fill: Fill;
    if (!properties.fill.pattern) {
      fill = new Fill({ color: properties.fill.color1 || defaults.fill.color1 });
    } else {
      const color = FillPatternFactory.create(properties.fill) || properties.fill.color1 || defaults.fill.color1;
      fill = new Fill({ color });
    }

    const stroke = new Stroke({
      width: properties.stroke.width || defaults.stroke.width,
      color: properties.stroke.color || defaults.stroke.color,
    });

    let pointStyle: Circle | undefined;
    if (properties.point.size) {
      pointStyle = new Circle({
        fill: fill,
        stroke: stroke,
        radius: properties.point.size,
      });
    }

    let textStyle: Text | undefined;
    if (properties.text.value) {
      const text = properties.text;
      const fontName = text.font || defaults.text.font;
      const fontSize = text.size || defaults.text.size;
      const font = `${fontSize}px ${fontName}`;
      textStyle = new Text({
        fill: new Fill({ color: text.color || defaults.text.color }),
        font,
        text: text.value,
        offsetX: text.offsetX,
        offsetY: text.offsetY,
        textAlign: text.alignment,
      });
    }

    return [new Style({ fill, stroke, image: pointStyle, text: textStyle })];
  }

  public static openLayersStyleFunction(): StyleFunction {
    const cache: StyleCache = new StyleCache();
    return (feat: FeatureLike): Style[] => {
      const feature = FeatureWrapper.fromFeatureLike(feat);
      if (!feature) {
        return [];
      }

      const properties = feature.getStyle();

      let style = cache.get(properties);
      if (!style) {
        style = VectorStyles.createStyle(properties);
        cache.put(properties, style);
      }

      if (feature.isSelected()) {
        return [...style, ...SelectionStyle.getForFeature(feature.unwrap())];
      }

      return style;
    };
  }
}
