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

import { ActionType, MapAction } from './actions';
import { mapInitialState, MapState } from './state';

/**
 * Warning: this function MUST be fast, and we MUST clone state to return a new state object
 *
 */
export function mapReducer(state = mapInitialState, action: MapAction): MapState {
  if (!Object.values(ActionType).includes(action.type)) {
    return state;
  }

  switch (action.type) {
    case ActionType.SetTool: {
      const newState: MapState = { ...state };
      newState.tool = action.tool;
      return newState;
    }

    case ActionType.SetFillColor1: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.fill = { ...newState.currentStyle.fill };
      newState.currentStyle.fill.color1 = action.color;
      return newState;
    }

    case ActionType.SetFillColor2: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.fill = { ...newState.currentStyle.fill };
      newState.currentStyle.fill.color2 = action.color;
      return newState;
    }

    case ActionType.SetStrokeColor: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.stroke = { ...newState.currentStyle.stroke };
      newState.currentStyle.stroke.color = action.color;
      return newState;
    }

    case ActionType.SetStrokeWidth: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.stroke = { ...newState.currentStyle.stroke };
      newState.currentStyle.stroke.width = action.width;
      return newState;
    }

    case ActionType.SetFillPattern: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.fill = { ...newState.currentStyle.fill };
      newState.currentStyle.fill.pattern = action.pattern;
      return newState;
    }

    case ActionType.SetTextColor: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.text = { ...newState.currentStyle.text };
      newState.currentStyle.text.color = action.color;
      return newState;
    }

    case ActionType.SetTextOffsetX: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.text = { ...newState.currentStyle.text };
      newState.currentStyle.text.offsetX = action.value;
      return newState;
    }

    case ActionType.SetTextOffsetY: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.text = { ...newState.currentStyle.text };
      newState.currentStyle.text.offsetY = action.value;
      return newState;
    }

    case ActionType.SetTextRotation: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.text = { ...newState.currentStyle.text };
      newState.currentStyle.text.rotation = action.value;
      return newState;
    }

    case ActionType.SetTextSize: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.text = { ...newState.currentStyle.text };
      newState.currentStyle.text.size = action.size;
      return newState;
    }

    case ActionType.SetPointIcon: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.point = { ...newState.currentStyle.point };
      newState.currentStyle.point.icon = action.icon;
      return newState;
    }

    case ActionType.SetPointSize: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.point = { ...newState.currentStyle.point };
      newState.currentStyle.point.size = action.size;
      return newState;
    }

    case ActionType.SetPointColor: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.point = { ...newState.currentStyle.point };
      newState.currentStyle.point.color = action.color;
      return newState;
    }

    case ActionType.SetMainMapDimensions: {
      const newState: MapState = { ...state };
      newState.mainMapDimensions = action.dimensions;
      return newState;
    }

    default:
      return state;
  }
}
