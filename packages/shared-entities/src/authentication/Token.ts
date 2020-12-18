import { AbcUser } from '../user';

export interface Token {
  userStatus: UserStatus;
  user: AbcUser;
}

export enum UserStatus {
  AUTHENTICATED = 'AUTHENTICATED',
  ANONYMOUS = 'ANONYMOUS',
}
