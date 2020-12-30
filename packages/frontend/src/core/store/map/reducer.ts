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
      newState.drawingTool = action.tool;
      return newState;
    }

    case ActionType.SetFillColor: {
      const newState: MapState = { ...state };
      newState.currentStyle = { ...newState.currentStyle };
      newState.currentStyle.fill = { ...newState.currentStyle.fill };
      newState.currentStyle.fill.color = action.color;
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

    default:
      return state;
  }
}
