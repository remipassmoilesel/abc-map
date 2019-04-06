import {DrawingTool, DrawingTools} from "../../lib/map/DrawingTool";

export interface IMapState {
  drawingTool: DrawingTool;
}

export const mapInitialState: IMapState = {
  drawingTool: DrawingTools.None
};
