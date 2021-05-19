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
