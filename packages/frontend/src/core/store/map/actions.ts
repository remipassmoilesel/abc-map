import { MapTool } from '@abc-map/shared-entities';

export enum ActionType {
  SetTool = 'SetTool',
  SetFillColor = 'SetFillColor',
  SetStrokeColor = 'SetStrokeColor',
  SetStrokeWidth = 'SetStrokeWidth',
}

export interface SetTool {
  type: ActionType.SetTool;
  tool: MapTool;
}

export interface SetFillColor {
  type: ActionType.SetFillColor;
  color: string;
}

export interface SetStrokeColor {
  type: ActionType.SetStrokeColor;
  color: string;
}

export interface SetStrokeWidth {
  type: ActionType.SetStrokeWidth;
  width: number;
}

export type MapAction = SetTool | SetStrokeColor | SetFillColor | SetStrokeWidth;

export class MapActions {
  public static setTool(tool: MapTool): MapAction {
    return {
      type: ActionType.SetTool,
      tool,
    };
  }

  public static setFillColor(color: string): MapAction {
    return {
      type: ActionType.SetFillColor,
      color,
    };
  }

  public static setStrokeColor(color: string): MapAction {
    return {
      type: ActionType.SetStrokeColor,
      color,
    };
  }

  public static setStrokeWidth(width: number): MapAction {
    return {
      type: ActionType.SetStrokeWidth,
      width,
    };
  }
}
