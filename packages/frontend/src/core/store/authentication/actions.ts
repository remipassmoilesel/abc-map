import { Token } from '@abc-map/shared-entities';

export enum ActionType {
  Login = 'Login',
  Logout = 'Logout',
}

export interface Login {
  type: ActionType.Login;
  token: Token;
  tokenString: string;
}

export interface Logout {
  type: ActionType.Logout;
}

export type AuthenticationAction = Login | Logout;

export class AuthenticationActions {
  public static login(token: Token, tokenString: string): AuthenticationAction {
    return {
      type: ActionType.Login,
      token,
      tokenString,
    };
  }

  public static logout(): AuthenticationAction {
    return {
      type: ActionType.Logout,
    };
  }
}
