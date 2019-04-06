import {DrawingTool} from "../DrawingTool";
import {geom} from "openlayers";
import GeometryType = geom.GeometryType;

export class OpenLayersHelper {

  static toolToGeometryType(tool: DrawingTool): GeometryType {
    switch (tool) {
      case DrawingTool.Circle:
        return 'Circle';
      case DrawingTool.Polygon:
        return 'Polygon';
      case DrawingTool.LineString:
        return 'LineString';
      case DrawingTool.Point:
        return 'Point';
      default:
        throw new Error("Cannot convert: " + tool)
    }
  }

}
