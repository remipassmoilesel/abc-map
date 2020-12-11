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

    default:
      return state;
  }
}
