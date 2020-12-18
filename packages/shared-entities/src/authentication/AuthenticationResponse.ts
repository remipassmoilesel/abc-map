export interface AuthenticationResponse {
  status: AuthenticationStatus;
  token?: string;
}

export enum AuthenticationStatus {
  Successful = 'Successful',
  Refused = 'Refused',
  UnknownUser = 'UnknownUser',
  DisabledUser = 'DisabledUser',
}
