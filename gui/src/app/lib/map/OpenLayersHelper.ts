import {DrawingTool, DrawingTools} from "../DrawingTool";
import {geom} from "openlayers";
import GeometryType = geom.GeometryType;

export class OpenLayersHelper {

  static toolToGeometryType(tool: DrawingTool): GeometryType {
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
        throw new Error("Cannot convert: " + tool)
    }
  }

}
