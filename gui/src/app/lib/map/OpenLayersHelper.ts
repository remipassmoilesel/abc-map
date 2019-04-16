import {DrawingTool, DrawingTools} from './DrawingTool';
import {geom} from 'openlayers';
import {OlMap, OlObject, OlObjectReadOnly, OlSource} from '../OpenLayersImports';
import {IAbcStyleContainer} from './AbcStyles';
import * as _ from 'lodash';
import Vector from 'ol/layer/Vector';
import GeometryType = geom.GeometryType;

export class OpenLayersHelper {

  public static toolToGeometryType(tool: DrawingTool): GeometryType {
    switch (tool.id) {
      case DrawingTools.Circle.id:
        return 'Circle';
      case DrawingTools.Polygon.id:
        return 'Polygon';
      case DrawingTools.LineString.id:
        return 'LineString';
      case DrawingTools.Point.id:
        return 'Point';
      default:
        throw new Error('Cannot convert: ' + tool);
    }
  }

  private static readonly layerId = 'abcLayerId';
  private static readonly styleId = 'abcStyle';

  public static getLayerId(source: OlSource): string {
    return source.get(this.layerId);
  }

  public static setLayerId(source: OlSource, layerId: string): void {
    source.set(this.layerId, layerId, true);
  }

  public static setStyle(feature: OlObject, style: IAbcStyleContainer): void {
    feature.set(this.styleId, style);
  }

  public static getStyle(feature: OlObjectReadOnly): IAbcStyleContainer | undefined {
    return feature.get(this.styleId);
  }

  public static findVectorLayer(map: OlMap, layerId: string): Vector | undefined {
    return _.find(map.getLayers().getArray(),
      lay => lay instanceof Vector && OpenLayersHelper.getLayerId(lay.getSource()) === layerId) as Vector | undefined;
  }
}
