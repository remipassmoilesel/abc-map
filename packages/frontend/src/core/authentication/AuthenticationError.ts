export enum ErrorType {
  InvalidCredentials = 'InvalidCredentials',
  EmailAlreadyInUse = 'EmailAlreadyInUse',
}

export class AuthenticationError extends Error {
  constructor(public readonly type: ErrorType, message?: string) {
    super(`${type}: ${message || '<No message>'}`);
  }
}
