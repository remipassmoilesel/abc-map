import {DrawingTool, DrawingTools} from '../../lib/map/DrawingTool';

export interface IMapState {
  drawingTool: DrawingTool;
  style: {
    activeForegroundColor: string
    activeBackgroundColor: string
  }
}

export const mapInitialState: IMapState = {
  drawingTool: DrawingTools.None,
  style: {
    activeForegroundColor: 'rgb(0,0,0)',
    activeBackgroundColor: 'rgb(0,0,0)'
  }
};
