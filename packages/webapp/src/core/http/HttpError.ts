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

import { AxiosError } from 'axios';

export class HttpError {
  public static isHttpCode(err: AxiosError | Error | unknown, code: number): err is AxiosError {
    return (typeof err === 'object' && err !== null && 'response' in err && (err as AxiosError).response?.status === code) || false;
  }

  public static isUnauthorized(err: AxiosError | Error | unknown): err is AxiosError {
    return this.isHttpCode(err, 401);
  }

  public static isForbidden(err: AxiosError | Error | unknown): err is AxiosError {
    return this.isHttpCode(err, 403);
  }

  public static isTooManyRequests(err: AxiosError | Error | unknown): err is AxiosError {
    return this.isHttpCode(err, 429);
  }

  public static isTooManyProject(err: AxiosError | Error | unknown): err is AxiosError {
    return this.isHttpCode(err, 402);
  }

  public static isConflict(err: AxiosError | Error | unknown): err is AxiosError {
    return this.isHttpCode(err, 409);
  }
}
