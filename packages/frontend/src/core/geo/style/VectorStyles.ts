import Feature, { FeatureLike } from 'ol/Feature';
import Style, { StyleFunction } from 'ol/style/Style';
import { Circle, Fill, Stroke } from 'ol/style';
import { FillPatterns } from '@abc-map/shared-entities';
import { Logger } from '../../utils/Logger';
import { AbcStyleProperties } from './AbcStyleProperties';
import { SelectionStyle } from './SelectionStyle';
import { StyleCache } from './StyleCache';
import { FillPatternFactory } from './FillPatternFactory';
import { FeatureWrapper } from '../features/FeatureWrapper';

const logger = Logger.get('VectorStyles.ts');

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
    return (feat: FeatureLike): Style | Style[] => {
      if (!(feat instanceof Feature)) {
        return [];
      }

      const feature = FeatureWrapper.from(feat);
      if (feature.isSelected()) {
        return SelectionStyle.getForFeature(feat);
      }

      const properties = feature.getStyle();
      let style = cache.get(properties);
      if (!style) {
        style = VectorStyles.createStyle(properties);
        cache.put(properties, style);
      }
      return style;
    };
  }
}
