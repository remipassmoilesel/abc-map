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

import * as jwt from 'jsonwebtoken';
import { TokenHelper } from './TokenHelper';

describe('TokenHelper', () => {
  describe('isExpired()', () => {
    it('should return true', () => {
      const token = jwt.sign({}, 'secret', {
        expiresIn: '1d',
      });

      expect(TokenHelper.isExpired(token)).toBe(false);
    });

    it('should return false if expired', () => {
      const token = jwt.sign({}, 'secret', {
        expiresIn: '0s',
      });

      expect(TokenHelper.isExpired(token)).toBe(true);
    });

    it('should return false if no expiration found', () => {
      const token = jwt.sign({}, 'secret');

      expect(TokenHelper.isExpired(token)).toBe(true);
    });
  });

  describe('getRemainingSecBeforeExpiration()', () => {
    it('should return 3600', () => {
      const token = jwt.sign({}, 'secret', {
        expiresIn: '1h',
      });

      // This assertion is adapted to test context
      const remaining = TokenHelper.getRemainingSecBeforeExpiration(token);
      expect(remaining > 3598 && remaining < 3602).toBe(true);
    });

    it('should return 0', () => {
      const token = jwt.sign({}, 'secret', {
        expiresIn: '0s',
      });

      // This assertion is adapted to test context
      const remaining = TokenHelper.getRemainingSecBeforeExpiration(token);
      expect(remaining > -2 && remaining < 2).toBe(true);
    });
  });
});
