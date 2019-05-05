import {Action} from '@ngrx/store';

// Actions are events

export namespace UserModule {

  export enum ActionTypes {
    USER_LOGIN = '[user] User logged in',
  }

  export class UserLogin implements Action {
    readonly type = ActionTypes.USER_LOGIN;

    constructor(public payload: { username: string, token: string }) {}
  }

  export type ActionsUnion = UserLogin;
}
