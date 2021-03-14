import { AbcUser } from '../user';

export interface Token {
  userStatus: UserStatus;
  user: AbcUser;
}

export enum UserStatus {
  Authenticated = 'Authenticated',
  Anonymous = 'Anonymous',
}
