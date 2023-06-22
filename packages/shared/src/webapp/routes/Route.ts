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
import { Logger } from '../../commons';
import { Language } from '../../lang';

const logger = Logger.get('Route.ts');

export declare type Params = { [k: string]: string | undefined };

export class Route<T extends Params> {
  constructor(private readonly _raw: string, private lang: Language | (() => Language)) {}

  public raw(): string {
    return this._raw;
  }

  /**
   * Template lang and remove optional parameters.
   */
  public format(): string {
    const result = this._raw.replace(/:[a-z0-9]+\?\/?/gi, '');
    return this.replaceParam(result, 'lang', this.getLang());
  }

  public withParams(params: T): string {
    let result = this._raw;

    for (const key in params) {
      const value = params[key];
      if (typeof value === 'string') {
        result = this.replaceParam(result, key, value);
      } else {
        logger.error(`Invalid value supplied for ${key} in route: ${this._raw}`);
      }
    }

    return this.replaceParam(result, 'lang', this.getLang());
  }

  public getLang(): Language {
    return typeof this.lang === 'function' ? this.lang() : this.lang;
  }

  private replaceParam(input: string, key: string, value: string): string {
    const replaced = input.replace(new RegExp(`:${key}\\??`), value);
    if (replaced === input) {
      logger.error(`Parameters ${key} have not been found in route: ${this._raw}`);
    }
    return replaced;
  }
}
