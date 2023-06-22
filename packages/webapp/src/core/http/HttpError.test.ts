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
