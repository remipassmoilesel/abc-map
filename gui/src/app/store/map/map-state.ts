import {DrawingTool, DrawingTools} from "../../lib/DrawingTool";

export interface IMapState {
  drawingTool: DrawingTool;
}

export const mapInitialState: IMapState = {
  drawingTool: DrawingTools.None
};
