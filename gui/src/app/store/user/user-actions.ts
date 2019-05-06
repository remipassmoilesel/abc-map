import {Action} from '@ngrx/store';

// Actions are events

export namespace UserModule {

  export enum ActionTypes {
    USER_LOGIN = '[user] User logged in',
    USER_LOGOUT = '[user] User logged out',
  }

  export class UserLogin implements Action {
    readonly type = ActionTypes.USER_LOGIN;

    constructor(public payload: { username: string, token: string }) {
    }
  }

  export class UserLogout implements Action {
    readonly type = ActionTypes.USER_LOGOUT;

    constructor() {
    }
  }

  export type ActionsUnion = UserLogin | UserLogout;
}
