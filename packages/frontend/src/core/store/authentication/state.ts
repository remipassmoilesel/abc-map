import { AbcUser, UserStatus } from '@abc-map/shared-entities';

export interface AuthenticationState {
  userStatus?: UserStatus;
  user?: AbcUser;
  tokenString?: string;
}

export const authenticationInitialState: AuthenticationState = {};
