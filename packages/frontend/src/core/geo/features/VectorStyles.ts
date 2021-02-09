import Feature, { FeatureLike } from 'ol/Feature';
import Style, { StyleFunction } from 'ol/style/Style';
import { Circle, Fill, Stroke } from 'ol/style';
import { StyleProperties } from '@abc-map/shared-entities';
import { Logger } from '../../utils/Logger';
import { AbcStyle } from './AbcStyle';
import Geometry from 'ol/geom/Geometry';
import { SelectionStyle } from './SelectionStyle';
import { FeatureHelper } from './FeatureHelper';
import { StyleCache } from './StyleCache';

const logger = Logger.get('VectorStyles.ts', 'debug');

const defaults = {
  fill: {
    color: '#fff',
  },
  stroke: {
    color: '#000',
    width: 2,
  },
};

export class VectorStyles {
  /**
   * Extract style properties from feature
   * @param feature
   */
  public static getProperties(feature: FeatureLike): AbcStyle {
    return {
      fill: {
        color: feature.get(StyleProperties.FillColor),
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
  public static setProperties(feature: Feature<Geometry>, style: AbcStyle): void {
    feature.set(StyleProperties.FillColor, style.fill.color);
    feature.set(StyleProperties.StrokeColor, style.stroke.color);
    feature.set(StyleProperties.StrokeWidth, style.stroke.width);
  }

  public static createStyle(properties: AbcStyle): Style | Style[] {
    const fill = new Fill({ color: properties.fill.color || defaults.fill.color });
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
