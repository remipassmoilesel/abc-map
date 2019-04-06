import {DrawingTool} from "../../lib/DrawingTool";

export interface IMapState {
  drawingTool: DrawingTool;
}

export const mapInitialState: IMapState = {
  drawingTool: DrawingTool.None
};
