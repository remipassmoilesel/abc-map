export interface AccountConfirmationResponse {
  status: AccountConfirmationStatus;
  error?: string;
  token?: string;
}

export interface AccountConfirmationRequest {
  userId: string;
  secret: string;
}

export enum AccountConfirmationStatus {
  InProgress = 'InProgress',
  UserNotFound = 'UserNotFound',
  Failed = 'Failed',
  Succeed = 'Succeed',
}
