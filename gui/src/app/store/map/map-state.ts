import {DrawingTool, DrawingTools} from '../../lib/map/DrawingTool';
import {IAbcStyleContainer} from '../../lib/map/abcStyleRendering';

export interface IMapState {
  drawingTool: DrawingTool;
  activeStyle: IAbcStyleContainer;
}

export const mapInitialState: IMapState = {
  drawingTool: DrawingTools.None,
  activeStyle: {
    foreground: 'rgb(37,33,236)',
    background: 'rgba(0,0,0,0)',
    strokeWidth: 5
  }
};
