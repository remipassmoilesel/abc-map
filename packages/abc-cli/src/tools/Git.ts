/**
 * Copyright © 2022 Rémi Pace.
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

import { Shell } from './Shell';
import { Config } from '../config/Config';

export class Git {
  public static create(config: Config): Git {
    return new Git(new Shell(config));
  }

  constructor(private shell: Shell) {}

  public isRepoDirty(): boolean {
    try {
      this.shell.sync('git diff --quiet', { stdio: 'pipe' });
      return false;
    } catch (e) {
      return true;
    }
  }
}
