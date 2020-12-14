import GeometryType from 'ol/geom/GeometryType';

export interface DrawingTool {
  label: string;
  geometryType: GeometryType | 'None';
}

export class DrawingTools {
  public static readonly None: DrawingTool = {
    label: 'Aucun',
    geometryType: 'None',
  };

  public static readonly Point: DrawingTool = {
    label: 'Point',
    geometryType: GeometryType.POINT,
  };

  public static readonly LineString: DrawingTool = {
    label: 'Ligne',
    geometryType: GeometryType.LINE_STRING,
  };

  public static readonly Polygon: DrawingTool = {
    label: 'Polygone',
    geometryType: GeometryType.POLYGON,
  };

  public static readonly Circle: DrawingTool = {
    label: 'Cercle',
    geometryType: GeometryType.CIRCLE,
  };

  public static readonly All: DrawingTool[] = [DrawingTools.None, DrawingTools.Point, DrawingTools.LineString, DrawingTools.Polygon, DrawingTools.Circle];
}
