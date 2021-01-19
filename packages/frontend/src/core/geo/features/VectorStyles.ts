import Feature, { FeatureLike } from 'ol/Feature';
import Style, { StyleFunction } from 'ol/style/Style';
import { Circle, Fill, Stroke } from 'ol/style';
import { StyleProperties } from '@abc-map/shared-entities';
import { Logger } from '../../utils/Logger';
import { AbcStyle } from './AbcStyle';
import _ from 'lodash';
import Geometry from 'ol/geom/Geometry';
import { SelectionStyle } from './SelectionStyle';
import { FeatureHelper } from './FeatureHelper';

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

// TODO: test all
export class VectorStyles {
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

  public static setProperties(feature: Feature<Geometry>, style: AbcStyle): void {
    feature.set(StyleProperties.FillColor, style.fill.color);
    feature.set(StyleProperties.StrokeColor, style.stroke.color);
    feature.set(StyleProperties.StrokeWidth, style.stroke.width);
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  public static styleFactory(feature: FeatureLike, resolution: number): Style | Style[] {
    const properties = VectorStyles.getProperties(feature);

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

    const olStyle = new Style({ fill, stroke, image });

    logger.debug('Created style: ', { style: olStyle, feature });
    return olStyle;
  }

  public static cachingStyleFunc(): StyleFunction {
    const cache: [AbcStyle, Style | Style[]][] = [];
    const styleFromCache = (properties: AbcStyle): Style | Style[] | undefined => {
      // TODO: Use composite id instead of equal
      const found = cache.find((tupl) => _.isEqual(properties, tupl[0]));
      return found ? found[1] : undefined;
    };

    return (feature: FeatureLike, resolution: number): Style | Style[] => {
      if (feature instanceof Feature && FeatureHelper.isSelected(feature)) {
        return SelectionStyle.getForFeature(feature);
      }

      const styleProperties = VectorStyles.getProperties(feature);
      let style = styleFromCache(styleProperties);
      if (!style) {
        style = VectorStyles.styleFactory(feature, resolution);
        cache.push([styleProperties, style]);
      }

      return style;
    };
  }
}
