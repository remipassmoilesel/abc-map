import { DrawingTool } from '../../map/DrawingTools';

export enum ActionType {
  SetTool = 'SetTool',
}

export interface SetTool {
  type: ActionType.SetTool;
  tool: DrawingTool;
}

export type MapAction = SetTool;

export class MapActions {
  public static setTool(tool: DrawingTool): MapAction {
    return {
      type: ActionType.SetTool,
      tool,
    };
  }
}
