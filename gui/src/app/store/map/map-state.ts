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
    activeForegroundColor: 'rgb(37,33,236)',
    activeBackgroundColor: 'rgba(0,0,0,0)'
  }
};
