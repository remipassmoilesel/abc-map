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

import * as childProcess from 'child_process';
import { Config } from '../config/Config';
import { Logger } from './Logger';
import { ChildProcess, ExecSyncOptions, SpawnOptions } from 'child_process';

const logger = Logger.get('Banners.ts', 'info');

export class Shell {
  constructor(private config: Config) {}

  public sync(cmd: string, options?: ExecSyncOptions): void {
    const _options: ExecSyncOptions = {
      stdio: 'inherit',
      cwd: this.config.getProjectRoot(),
      ...options,
    };

    logger.info(`Running '${cmd.replace(/\s+/gi, ' ')}' with options ${JSON.stringify(_options)}`);
    childProcess.execSync(cmd, _options);
  }

  public async(cmd: string, options?: SpawnOptions): ChildProcess {
    const _options: SpawnOptions = {
      stdio: 'inherit',
      cwd: this.config.getProjectRoot(),
      ...options,
    };

    logger.info(`Spawning '${cmd.replace(/\s+/gi, ' ')}' with options ${JSON.stringify(_options)}`);
    return childProcess.spawn('bash', ['-c', cmd], _options);
  }
}
