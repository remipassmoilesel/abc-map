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
const VALID_HTTP_URL = /^https?:\/\/.+$/;
const VALID_HTTPS_URL = /^https:\/\/.+$/;

export class ValidationHelper {
  public static email(email: string): boolean {
    return email.match(VALID_EMAIL) !== null;
  }

  /**
   * This method return true if 'url' looks like a URL.
   *
   * Warning:
   * - URL validation is weak.
   * - We enforce usage of HTTPS because of browser security policies.*
   * @param url
   */
  public static url(url: string): boolean {
    if (window.location.protocol.indexOf('https') !== -1) {
      return url.match(VALID_HTTPS_URL) !== null;
    } else {
      return url.match(VALID_HTTP_URL) !== null;
    }
  }

  public static xyzUrl(url: string): boolean {
    const x = url.indexOf('{x}') !== -1;
    const y = url.indexOf('{y}') !== -1;
    const z = url.indexOf('{z}') !== -1;
    return this.url(url) && x && y && z;
  }

  // WARNING: modify this method may require data migration (user profiles)
  public static password(password: string): PasswordStrength {
    return passwordStrength(password).id >= 1 ? PasswordStrength.Correct : PasswordStrength.Weak;
  }
}
