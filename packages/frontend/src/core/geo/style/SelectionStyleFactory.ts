import GeometryType from 'ol/geom/GeometryType';
import Style from 'ol/style/Style';
import { Fill, Stroke } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import { Logger } from '@abc-map/frontend-commons';

export const logger = Logger.get('SelectionStyleFactory.ts');

// TODO: test

const fillColor = '#ffc9c955';
const strokeColor = '#ff0000';
const width = 3;

const strokeDash = new Stroke({
  color: strokeColor,
  width: width,
  lineCap: 'square',
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
  }),
];

const lineString = [
  new Style({
    stroke: strokeDash,
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
    zIndex: Infinity,
  }),
];

const geometryCollection = polygon.concat(lineString, point);

export class SelectionStyleFactory {
  public getForFeature(feature: Feature<Geometry>): Style[] {
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
