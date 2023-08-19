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

import jwtDecode from 'jwt-decode';
import { AuthenticationToken } from '@abc-map/shared';

export class TokenHelper {
  /**
   * Return true if token is expired. If token does not have an expiry, it will be considered expired.
   * @param token
   */
  public static isExpired(token: string): boolean {
    return TokenHelper.getRemainingSecBeforeExpiration(token) <= 0;
  }

  /**
   * Return remaining time before expiration in second.
   *
   * @param token
   */
  public static getRemainingSecBeforeExpiration(token: string): number {
    const content = jwtDecode<AuthenticationToken>(token);
    const now = Date.now() / 1000;
    const expiry = content.exp || now;
    return Math.round(expiry - now);
  }
}
