import { ActionType, MapAction } from './actions';
import { mapInitialState, MapState } from './state';

/**
 * Warning: this function MUST be fast, and we MUST clone state to return a new state object
 *
 */
export function mapStateReducer(state = mapInitialState, action: MapAction): MapState {
  if (!Object.values(ActionType).includes(action.type)) {
    return state;
  }

  switch (action.type) {
    case ActionType.SetTool: {
      const newState: MapState = { ...state };
      newState.drawingTool = action.tool;
      return newState;
    }

    default:
      return state;
  }
}
