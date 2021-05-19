import { passwordStrength } from 'check-password-strength';

export enum Strength {
  Weak = 'Weak',
  Correct = 'Correct',
}

export class PasswordStrength {
  public static check(password: string): Strength {
    return passwordStrength(password).id >= 1 ? Strength.Correct : Strength.Weak;
  }
}
