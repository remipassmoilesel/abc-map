/**
 * Copyright © 2023 Rémi Pace.
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

import * as sjcl from 'sjcl';
import { Errors } from './Errors';

/**
 * Warning: changes in this file will require a data migration
 */
export class Encryption {
  private static readonly PREFIX = 'encrypted:';

  public static async encrypt(text: string, secret: string): Promise<string> {
    return this.PREFIX + btoa(JSON.stringify(sjcl.encrypt(secret + secret, text).toString()));
  }

  public static async decrypt(text: string, secret: string): Promise<string> {
    const encrypted = JSON.parse(atob(text.substr(this.PREFIX.length)));
    try {
      return sjcl.decrypt(secret + secret, encrypted).toString();
    } catch (err) {
      Errors.wrongPassword(err);
    }
  }
}
