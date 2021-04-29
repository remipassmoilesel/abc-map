import { FillPatterns } from '@abc-map/shared-entities';
import { MapTool } from '@abc-map/frontend-commons';
import { PointIcons } from '../../geo/style/PointIcons';

export enum ActionType {
  SetTool = 'SetTool',
  SetFillColor1 = 'SetFillColor1',
  SetFillColor2 = 'SetFillColor2',
  SetStrokeColor = 'SetStrokeColor',
  SetStrokeWidth = 'SetStrokeWidth',
  SetFillPattern = 'SetFillPattern',
  SetTextColor = 'SetTextColor',
  SetTextSize = 'SetTextSize',
  SetPointIcon = 'SetPointIcon',
  SetPointSize = 'SetPointSize',
  SetPointColor = 'SetPointColor',
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

export interface SetTextColor {
  type: ActionType.SetTextColor;
  color: string;
}

export interface SetTextSize {
  type: ActionType.SetTextSize;
  size: number;
}

export interface SetPointIcon {
  type: ActionType.SetPointIcon;
  icon: PointIcons;
}

export interface SetPointSize {
  type: ActionType.SetPointSize;
  size: number;
}

export interface SetPointColor {
  type: ActionType.SetPointColor;
  color: string;
}

export type MapAction =
  | SetTool
  | SetStrokeColor
  | SetFillColor1
  | SetFillColor2
  | SetStrokeWidth
  | SetFillPattern
  | SetTextColor
  | SetTextSize
  | SetPointIcon
  | SetPointSize
  | SetPointColor;

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

  public static setTextColor(color: string): MapAction {
    return {
      type: ActionType.SetTextColor,
      color,
    };
  }

  public static setTextSize(size: number): MapAction {
    return {
      type: ActionType.SetTextSize,
      size,
    };
  }

  public static setPointIcon(icon: PointIcons): MapAction {
    return {
      type: ActionType.SetPointIcon,
      icon,
    };
  }

  public static setPointSize(size: number): MapAction {
    return {
      type: ActionType.SetPointSize,
      size,
    };
  }

  public static setPointColor(color: string): MapAction {
    return {
      type: ActionType.SetPointColor,
      color,
    };
  }
}
