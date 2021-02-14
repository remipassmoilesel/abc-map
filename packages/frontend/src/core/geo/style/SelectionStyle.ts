import GeometryType from 'ol/geom/GeometryType';
import Style from 'ol/style/Style';
import { Fill, Stroke } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import { Logger } from '../../utils/Logger';

export const logger = Logger.get('SelectionStyle.ts');

const fillColor = '#ffc9c9';
const strokeColor = '#ff0000';
const width = 2;

const stroke = new Stroke({
  color: strokeColor,
  width: width,
  lineCap: 'square',
  lineDash: [5, 10],
});

const polygon = [
  new Style({
    fill: new Fill({
      color: fillColor,
    }),
    stroke,
  }),
];

const lineString = [
  new Style({
    stroke,
  }),
];

const circle = polygon.concat(lineString);

const point = [
  new Style({
    image: new CircleStyle({
      radius: width * 2,
      fill: new Fill({
        color: strokeColor,
      }),
      stroke,
    }),
    zIndex: Infinity,
  }),
];

const geometryCollection = polygon.concat(lineString, point);

export class SelectionStyle {
  public static getForFeature(feature: Feature<Geometry>): Style[] {
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
