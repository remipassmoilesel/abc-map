import {DrawingTool, DrawingTools} from './DrawingTool';
import {geom} from 'openlayers';
import {OlBase, OlMap, OlObject, OlObjectReadOnly, OlTileLoadFunctionType, OlVector, OlVectorSource} from '../OpenLayersImports';
import {IAbcStyleContainer} from './AbcStyles';
import * as _ from 'lodash';
import Vector from 'ol/layer/Vector';
import GeometryType = geom.GeometryType;

export class OpenLayersHelper {

  private static readonly layerId = 'abcLayerId';
  private static readonly styleId = 'abcStyle';

  public static toolToGeometryType(tool: DrawingTool): GeometryType {
    switch (tool.id) {
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

  public static getLayerId(layer: OlBase | OlVectorSource): string | undefined {
    return layer.get(this.layerId);
  }

  public static setLayerId(layer: OlBase | OlVectorSource, layerId: string): void {
    layer.set(this.layerId, layerId, true);
  }

  public static setStyle(feature: OlObject, style: IAbcStyleContainer): void {
    feature.set(this.styleId, style);
  }

  public static getStyle(feature: OlObjectReadOnly): IAbcStyleContainer | undefined {
    return feature.get(this.styleId);
  }

  public static findVectorLayer(map: OlMap, layerId: string): Vector | undefined {
    return _.find(map.getLayers().getArray(),
      lay => lay instanceof OlVector && OpenLayersHelper.getLayerId(lay) === layerId) as Vector | undefined;
  }

  public static createWmsLoaderWithAuthentication(username: string, password: string): OlTileLoadFunctionType {
    return (tile: any, src: string) => {
      const client = new XMLHttpRequest();
      client.open('GET', src);
      client.setRequestHeader('Authorization', 'Basic ' + window.btoa(username + ':' + password));
      client.onload = function() {
        tile.getImage().src = src;
      };
      client.send();
    };
  }

}
