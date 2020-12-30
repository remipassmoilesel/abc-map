import { Token } from '@abc-map/shared-entities';

export enum ActionType {
  Login = 'Login',
}

export interface Login {
  type: ActionType.Login;
  token: Token;
  tokenString: string;
}

export type AuthenticationAction = Login;

export class AuthenticationActions {
  public static login(token: Token, tokenString: string): AuthenticationAction {
    return {
      type: ActionType.Login,
      token,
      tokenString,
    };
  }
}
