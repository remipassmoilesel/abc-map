import { ActionType, ProjectAction } from './actions';
import { projectInitialState, ProjectState } from './state';

// TODO: test immutability of state in all branches

/**
 * Warning: this function MUST be fast, and we MUST clone state to return a new state object
 *
 * Also, project objet can be very heavy so please avoid deep clone
 */
export function projectStateReducer(state = projectInitialState, action: ProjectAction): ProjectState {
  if (!Object.values(ActionType).includes(action.type)) {
    return state;
  }

  switch (action.type) {
    case ActionType.NewProject: {
      const newState: ProjectState = { ...state };
      newState.current = action.project;
      return newState;
    }
    case ActionType.NewLayout: {
      if (!state.current) {
        return state;
      }

      const newState: ProjectState = { ...state };
      newState.current = { ...state.current, layouts: [...state.current.layouts, action.layout] };
      return newState;
    }
    case ActionType.UpdateLayout: {
      if (!state.current) {
        return state;
      }

      const layouts = state.current.layouts.map((lay) => {
        if (lay.id === action.layout.id) {
          return action.layout;
        }
        return lay;
      });

      const newState: ProjectState = { ...state };
      newState.current = { ...state.current, layouts };
      return newState;
    }
    case ActionType.ClearLayouts: {
      if (!state.current) {
        return state;
      }

      const newState: ProjectState = { ...state };
      newState.current = { ...state.current, layouts: [] };
      return newState;
    }

    default:
      return state;
  }
}
