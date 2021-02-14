import Feature, { FeatureLike } from 'ol/Feature';
import Style, { StyleFunction } from 'ol/style/Style';
import { Circle, Fill, Stroke } from 'ol/style';
import { FillPatterns, StyleProperties } from '@abc-map/shared-entities';
import { Logger } from '../../utils/Logger';
import { AbcStyleProperties } from './AbcStyleProperties';
import Geometry from 'ol/geom/Geometry';
import { SelectionStyle } from './SelectionStyle';
import { FeatureHelper } from '../features/FeatureHelper';
import { StyleCache } from './StyleCache';
import { FillPatternFactory } from './FillPatternFactory';

const logger = Logger.get('VectorStyles.ts', 'debug');

const defaults: AbcStyleProperties = {
  stroke: {
    color: '#000',
    width: 2,
  },
  fill: {
    color1: '#fff',
    color2: '#00f',
    pattern: FillPatterns.HatchingVertical,
  },
};

export class VectorStyles {
  /**
   * Extract style properties from feature
   * @param feature
   */
  public static getProperties(feature: FeatureLike): AbcStyleProperties {
    return {
      fill: {
        color1: feature.get(StyleProperties.FillColor1),
        color2: feature.get(StyleProperties.FillColor2),
        pattern: feature.get(StyleProperties.FillPattern),
      },
      stroke: {
        color: feature.get(StyleProperties.StrokeColor),
        width: feature.get(StyleProperties.StrokeWidth),
      },
    };
  }

  /**
   * Set style properties on feature
   * @param feature
   * @param style
   */
  public static setProperties(feature: Feature<Geometry>, style: AbcStyleProperties): void {
    feature.set(StyleProperties.StrokeColor, style.stroke.color);
    feature.set(StyleProperties.StrokeWidth, style.stroke.width);
    feature.set(StyleProperties.FillColor1, style.fill.color1);
    feature.set(StyleProperties.FillColor2, style.fill.color2);
    feature.set(StyleProperties.FillPattern, style.fill.pattern);
  }

  public static createStyle(properties: AbcStyleProperties): Style | Style[] {
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

    const image = new Circle({
      fill: fill,
      stroke: stroke,
      radius: 5,
    });

    return new Style({ fill, stroke, image });
  }

  public static openLayersStyleFunction(): StyleFunction {
    const cache: StyleCache = new StyleCache();
    return (feature: FeatureLike): Style | Style[] => {
      if (feature instanceof Feature && FeatureHelper.isSelected(feature)) {
        return SelectionStyle.getForFeature(feature);
      }

      const properties = VectorStyles.getProperties(feature);
      let style = cache.get(properties);
      if (!style) {
        style = VectorStyles.createStyle(properties);
        cache.put(properties, style);
      }

      return style;
    };
  }
}
