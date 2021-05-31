/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { passwordStrength } from 'check-password-strength';

export enum PasswordStrength {
  Weak = 'Weak',
  Correct = 'Correct',
}

const VALID_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const VALID_URL = /^https?:\/\/.+$/;

export class ValidationHelper {
  public static email(email: string): boolean {
    return email.match(VALID_EMAIL) !== null;
  }

  /**
   * Warning: URL validation is weak
   * @param email
   */
  public static url(email: string): boolean {
    return email.match(VALID_URL) !== null;
  }

  // WARNING: modify this method may require data migration (user profiles)
  public static password(password: string): PasswordStrength {
    return passwordStrength(password).id >= 1 ? PasswordStrength.Correct : PasswordStrength.Weak;
  }
}
