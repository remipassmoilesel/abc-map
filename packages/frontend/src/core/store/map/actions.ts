/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { FeatureStyle, FillPatterns } from '@abc-map/shared';
import { MapTool } from '@abc-map/shared';
import { DimensionsPx } from '../../utils/DimensionsPx';
import { IconName } from '../../../assets/point-icons/IconName';

export enum ActionType {
  SetTool = 'SetTool',
  SetFillColor1 = 'SetFillColor1',
  SetFillColor2 = 'SetFillColor2',
  SetStrokeColor = 'SetStrokeColor',
  SetStrokeWidth = 'SetStrokeWidth',
  SetFillPattern = 'SetFillPattern',
  SetTextColor = 'SetTextColor',
  SetTextSize = 'SetTextSize',
  SetTextOffsetX = 'SetTextOffsetX',
  SetTextOffsetY = 'SetTextOffsetY',
  SetTextRotation = 'SetTextRotation',
  SetPointIcon = 'SetPointIcon',
  SetPointSize = 'SetPointSize',
  SetPointColor = 'SetPointColor',
  SetMainMapDimensions = 'SetMainMapDimensions',
  SetDrawingStyle = 'SetDrawingStyle',
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

export interface SetTextOffsetX {
  type: ActionType.SetTextOffsetX;
  value: number;
}

export interface SetTextOffsetY {
  type: ActionType.SetTextOffsetY;
  value: number;
}

export interface SetTextRotation {
  type: ActionType.SetTextRotation;
  value: number;
}

export interface SetPointIcon {
  type: ActionType.SetPointIcon;
  icon: IconName;
}

export interface SetPointSize {
  type: ActionType.SetPointSize;
  size: number;
}

export interface SetPointColor {
  type: ActionType.SetPointColor;
  color: string;
}

export interface SetMainMapDimensions {
  type: ActionType.SetMainMapDimensions;
  dimensions: DimensionsPx;
}

export interface SetDrawingStyle {
  type: ActionType.SetDrawingStyle;
  style: FeatureStyle;
}

export type MapAction =
  | SetTool
  | SetStrokeColor
  | SetFillColor1
  | SetFillColor2
  | SetStrokeWidth
  | SetFillPattern
  | SetTextColor
  | SetTextOffsetX
  | SetTextOffsetY
  | SetTextRotation
  | SetTextSize
  | SetPointIcon
  | SetPointSize
  | SetPointColor
  | SetMainMapDimensions
  | SetDrawingStyle;

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

  public static setTextOffsetX(value: number): MapAction {
    return {
      type: ActionType.SetTextOffsetX,
      value,
    };
  }

  public static setTextOffsetY(value: number): MapAction {
    return {
      type: ActionType.SetTextOffsetY,
      value,
    };
  }

  public static setTextRotation(value: number): MapAction {
    return {
      type: ActionType.SetTextRotation,
      value,
    };
  }

  public static setTextSize(size: number): MapAction {
    return {
      type: ActionType.SetTextSize,
      size,
    };
  }

  public static setPointIcon(icon: IconName): MapAction {
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

  public static setMainMapDimensions(width: number, height: number): MapAction {
    return {
      type: ActionType.SetMainMapDimensions,
      dimensions: { width, height },
    };
  }

  public static setDrawingStyle(style: FeatureStyle): MapAction {
    return {
      type: ActionType.SetDrawingStyle,
      style,
    };
  }
}
