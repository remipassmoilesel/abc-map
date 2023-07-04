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
import { Fill, Stroke } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { AbcGeometryType, FeatureStyle, Logger } from '@abc-map/shared';
import Geometry from 'ol/geom/Geometry';

export const logger = Logger.get('HighlightedStyleFactory.ts');

const fillColor = 'rgb(241,241,51)';
const strokeColor = '#c7c72a';
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

const point = (size: number) => [
  new Style({
    image: new CircleStyle({
      radius: size,
      fill,
      stroke: strokePlain,
    }),
    zIndex,
  }),
];

const geometryCollection = polygon.concat(lineString, point(15));

export class HighlightedStyleFactory {
  public getForGeometry(geometry: Geometry | undefined, styleProperties: FeatureStyle): Style[] {
    if (!geometry) {
      return [];
    }

    const type = geometry.getType();

    if (AbcGeometryType.POINT === type) {
      return point((styleProperties.point?.size ?? 15) * 1.1);
    } else if (AbcGeometryType.LINE_STRING === type) {
      return lineString;
    } else if (AbcGeometryType.LINEAR_RING === type) {
      return lineString;
    } else if (AbcGeometryType.POLYGON === type) {
      return polygon;
    } else if (AbcGeometryType.MULTI_POINT === type) {
      return point((styleProperties.point?.size ?? 15) * 1.1);
    } else if (AbcGeometryType.MULTI_LINE_STRING === type) {
      return lineString;
    } else if (AbcGeometryType.MULTI_POLYGON === type) {
      return polygon;
    } else if (AbcGeometryType.GEOMETRY_COLLECTION === type) {
      return geometryCollection;
    } else if (AbcGeometryType.CIRCLE === type) {
      return circle;
    }

    logger.error(`Highlighted style not found for: ${geometry.getType()}`);
    return [];
  }
}
