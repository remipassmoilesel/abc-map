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

import debounce from 'lodash/debounce';

/**
 * This class keep password in memory for a limited amount of time.
 *
 * It is used to prevent too many password prompts for one projet.
 */
export class PasswordCache {
  private value?: string;

  constructor(private expirationMs = 10 * 60 * 1000) {}

  public set(value: string) {
    this.debouncedReset();
    this.value = value;
  }

  public get(): string | undefined {
    this.debouncedReset();
    return this.value;
  }

  private debouncedReset = debounce(() => this.reset(), this.expirationMs);

  public reset() {
    this.value = undefined;
  }
}
