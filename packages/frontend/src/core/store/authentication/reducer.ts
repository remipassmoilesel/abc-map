import { ActionType, AuthenticationAction } from './actions';
import { authenticationInitialState, AuthenticationState } from './state';

/**
 * Warning: this function MUST be fast, and we MUST clone state to return a new state object
 *
 */
export function authenticationStateReducer(state = authenticationInitialState, action: AuthenticationAction): AuthenticationState {
  if (!Object.values(ActionType).includes(action.type)) {
    return state;
  }

  switch (action.type) {
    case ActionType.Login: {
      const newState: AuthenticationState = { ...state };
      newState.tokenString = action.tokenString;
      newState.user = action.token.user;
      newState.userStatus = action.token.userStatus;
      return newState;
    }

    case ActionType.Logout: {
      const newState: AuthenticationState = { ...state };
      newState.tokenString = undefined;
      newState.user = undefined;
      newState.userStatus = undefined;
      return newState;
    }

    default:
      return state;
  }
}
