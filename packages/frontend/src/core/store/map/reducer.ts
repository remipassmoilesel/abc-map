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
  switch (action.type) {
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

    case ActionType.SetDrawingStyle: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };

      if (action.style.fill) {
        newState.currentStyle.fill = {
          color1: action.style.fill.color1 ?? newState.currentStyle.fill.color1,
          color2: action.style.fill.color2 ?? newState.currentStyle.fill.color2,
          pattern: action.style.fill.pattern ?? newState.currentStyle.fill.pattern,
        };
      }

      if (action.style.stroke) {
        newState.currentStyle.stroke = {
          color: action.style.stroke.color ?? newState.currentStyle.stroke.color,
          width: action.style.stroke.width ?? newState.currentStyle.stroke.width,
        };
      }

      if (action.style.text) {
        newState.currentStyle.text = {
          color: action.style.text.color ?? newState.currentStyle.text.color,
          font: action.style.text.font ?? newState.currentStyle.text.font,
          size: action.style.text.size ?? newState.currentStyle.text.size,
          offsetX: action.style.text.offsetX ?? newState.currentStyle.text.offsetX,
          offsetY: action.style.text.offsetY ?? newState.currentStyle.text.offsetY,
          rotation: action.style.text.rotation ?? newState.currentStyle.text.rotation,
        };
      }

      if (action.style.point) {
        newState.currentStyle.point = {
          icon: action.style.point.icon ?? newState.currentStyle.point.icon,
          size: action.style.point.size ?? newState.currentStyle.point.size,
          color: action.style.point.color ?? newState.currentStyle.point.color,
        };
      }

      return newState;
    }

    case ActionType.SetGeolocation: {
      const newState: MapState = { ...state, geolocation: { ...state.geolocation } };
      newState.geolocation.enabled = action.value;
      return newState;
    }

    case ActionType.SetFollowPosition: {
      const newState: MapState = { ...state, geolocation: { ...state.geolocation } };
      newState.geolocation.followPosition = action.value;
      return newState;
    }

    case ActionType.SetRotateMap: {
      const newState: MapState = { ...state, geolocation: { ...state.geolocation } };
      newState.geolocation.rotateMap = action.value;
      return newState;
    }

    default:
      return state;
  }
}
