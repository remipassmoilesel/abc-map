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

    default:
      return state;
  }
}
