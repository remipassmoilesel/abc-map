import {DrawingTool, DrawingTools} from './DrawingTool';
import {geom} from 'openlayers';
import {OlObject, OlSource} from '../OpenLayersImports';
import {IAbcStyleContainer} from './AbcStyles';
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

  public static getStyle(feature: OlObject): IAbcStyleContainer | undefined {
    return feature.get(this.styleId);
  }
}
