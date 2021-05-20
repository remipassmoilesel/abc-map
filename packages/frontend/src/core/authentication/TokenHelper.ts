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
