import {IUserState, userState} from './user-state';
import {UserModule} from './user-actions';
import * as _ from 'lodash';

// All objects must be deep cloned

export function userReducer(state = userState, action: UserModule.ActionsUnion): IUserState {

  switch (action.type) {
    case UserModule.ActionTypes.USER_LOGIN: {
      const newState = _.cloneDeep(state);
      newState.username = action.payload.username;
      newState.token = action.payload.token;
      newState.loggedIn = true;
      return newState;
    }

    default: {
      return state;
    }

  }
}
