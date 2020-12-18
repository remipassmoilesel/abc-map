export interface RegistrationResponse {
  status: RegistrationStatus;
}

export enum RegistrationStatus {
  Successful = 'Successful',
  EmailAlreadyExists = 'EmailAlreadyExists',
  Failed = 'Failed',
}
