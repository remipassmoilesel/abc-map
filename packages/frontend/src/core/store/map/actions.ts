import { FillPatterns, MapTool } from '@abc-map/shared-entities';

export enum ActionType {
  SetTool = 'SetTool',
  SetFillColor1 = 'SetFillColor1',
  SetFillColor2 = 'SetFillColor2',
  SetStrokeColor = 'SetStrokeColor',
  SetStrokeWidth = 'SetStrokeWidth',
  SetFillPattern = 'SetFillPattern',
}

export interface SetTool {
  type: ActionType.SetTool;
  tool: MapTool;
}

export interface SetFillColor1 {
  type: ActionType.SetFillColor1;
  color: string;
}

export interface SetFillColor2 {
  type: ActionType.SetFillColor2;
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

export interface SetFillPattern {
  type: ActionType.SetFillPattern;
  pattern: FillPatterns;
}

export type MapAction = SetTool | SetStrokeColor | SetFillColor1 | SetFillColor2 | SetStrokeWidth | SetFillPattern;

export class MapActions {
  public static setTool(tool: MapTool): MapAction {
    return {
      type: ActionType.SetTool,
      tool,
    };
  }

  public static setFillColor1(color: string): MapAction {
    return {
      type: ActionType.SetFillColor1,
      color,
    };
  }

  public static setFillColor2(color: string): MapAction {
    return {
      type: ActionType.SetFillColor2,
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

  public static setFillPattern(pattern: FillPatterns): MapAction {
    return {
      type: ActionType.SetFillPattern,
      pattern,
    };
  }
}
