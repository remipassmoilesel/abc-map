export interface AccountConfirmationResponse {
  status: AccountConfirmationStatus;
  error?: string;
  token?: string;
}

export enum AccountConfirmationStatus {
  InProgress = 'InProgress',
  UserNotFound = 'UserNotFound',
  Failed = 'Failed',
  Succeed = 'Succeed',
}
