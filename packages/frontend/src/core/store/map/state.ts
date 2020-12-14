import { DrawingTool, DrawingTools } from '../../map/DrawingTools';
import { Map } from 'ol';
import { MapFactory } from '../../map/MapFactory';

export interface MapState {
  drawingTool: DrawingTool;
  /**
   * Reference to the main map, containing present project layers and features.
   *
   * Warning: Map and layers ara mutable. Only one map is created.
   */
  mainMap: Map;
}

export const mapInitialState: MapState = {
  drawingTool: DrawingTools.None,
  mainMap: MapFactory.newDefaultMap(),
};
