import { DrawingTool, DrawingTools } from '../../map/DrawingTools';

export interface MapState {
  drawingTool: DrawingTool;
}

export const mapInitialState: MapState = {
  drawingTool: DrawingTools.None,
};
