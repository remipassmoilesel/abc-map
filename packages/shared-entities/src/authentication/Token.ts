import { AbcUser } from './AbcUser';

export interface Token {
  userStatus: UserStatus;
  user: AbcUser;
}

export enum UserStatus {
  Authenticated = 'Authenticated',
  Anonymous = 'Anonymous',
}
