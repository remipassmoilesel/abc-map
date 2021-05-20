import { HttpError } from './HttpError';
import { AxiosError } from 'axios';

describe('HttpError', () => {
  it('isUnauthorized()', () => {
    expect(HttpError.isUnauthorized(undefined)).toBe(false);
    expect(HttpError.isUnauthorized(fakeAxiosError(401))).toBe(true);
  });

  it('isForbidden()', () => {
    expect(HttpError.isForbidden(undefined)).toBe(false);
    expect(HttpError.isForbidden(fakeAxiosError(403))).toBe(true);
  });

  it('isTooManyRequests()', () => {
    expect(HttpError.isTooManyRequests(undefined)).toBe(false);
    expect(HttpError.isTooManyRequests(fakeAxiosError(429))).toBe(true);
  });
});

function fakeAxiosError(code: number): AxiosError {
  return { response: { status: code } } as any;
}
