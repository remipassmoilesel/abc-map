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

import GeometryType from 'ol/geom/GeometryType';
import Style from 'ol/style/Style';
import { Fill, Stroke } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { Logger } from '@abc-map/shared';
import { FeatureWrapper } from '../features/FeatureWrapper';

export const logger = Logger.get('SelectionStyleFactory.ts');

const fillColor = 'rgba(0,233,255,0.30)';
const strokeColor = '#00e9ff';
const width = 3;
const zIndex = Infinity;

const strokeDash = new Stroke({
  color: strokeColor,
  width: width,
  lineCap: 'round',
  lineDash: [5, 10],
});

const strokePlain = new Stroke({
  color: strokeColor,
  width: width,
});

const fill = new Fill({ color: fillColor });

const polygon = [
  new Style({
    fill,
    stroke: strokeDash,
    zIndex,
  }),
];

const lineString = [
  new Style({
    stroke: strokeDash,
    zIndex,
  }),
];

const circle = polygon.concat(lineString);

const point = [
  new Style({
    image: new CircleStyle({
      radius: width * 2,
      fill,
      stroke: strokePlain,
    }),
    zIndex,
  }),
];

const geometryCollection = polygon.concat(lineString, point);

export class SelectionStyleFactory {
  public getForFeature(feature: FeatureWrapper): Style[] {
    const geometry = feature.getGeometry()?.getType();
    if (!geometry) {
      return [];
    }

    if (GeometryType.POINT === geometry) {
      return point;
    } else if (GeometryType.LINE_STRING === geometry) {
      return lineString;
    } else if (GeometryType.LINEAR_RING === geometry) {
      return lineString;
    } else if (GeometryType.POLYGON === geometry) {
      return polygon;
    } else if (GeometryType.MULTI_POINT === geometry) {
      return point;
    } else if (GeometryType.MULTI_LINE_STRING === geometry) {
      return lineString;
    } else if (GeometryType.MULTI_POLYGON === geometry) {
      return polygon;
    } else if (GeometryType.GEOMETRY_COLLECTION === geometry) {
      return geometryCollection;
    } else if (GeometryType.CIRCLE === geometry) {
      return circle;
    }

    logger.error(`Selection style not found for: ${feature.getGeometry()?.getType()}`);
    return [];
  }
}
