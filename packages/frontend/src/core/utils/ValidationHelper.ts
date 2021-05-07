const VALID_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export class ValidationHelper {
  public static isEmailValid(email: string): boolean {
    return email.match(VALID_EMAIL) !== null;
  }
}
