import { ActionType, UiAction } from './actions';
import { uiInitialState, UiState } from './state';

/**
 * Warning: this function MUST be fast, and we MUST clone state to return a new state object
 *
 */
export function uiReducer(state = uiInitialState, action: UiAction): UiState {
  if (!Object.values(ActionType).includes(action.type)) {
    return state;
  }

  switch (action.type) {
    case ActionType.SetHistoryCapabilities: {
      const newState: UiState = { ...state };
      newState.historyCapabilities = { ...state.historyCapabilities };
      newState.historyCapabilities[action.key] = {
        canUndo: action.canUndo,
        canRedo: action.canRedo,
      };
      return newState;
    }

    case ActionType.CleanHistoryCapabilities: {
      const newState: UiState = { ...state };
      newState.historyCapabilities = {};
      return newState;
    }

    default:
      return state;
  }
}
