/**
 * Copyright © 2026 Rémi Pace.
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

import childProcess from 'child_process';
import type { Config } from '../config/Config.js';
import { Logger } from './Logger.js';
import type { ChildProcess, ExecSyncOptions, SpawnOptions } from 'child_process';

const logger = Logger.get('Shell.ts', 'info');

export class Shell {
  constructor(private config: Config) {}

  public sync(cmd: string, options?: ExecSyncOptions & { silent?: boolean }): string | Buffer {
    const _options: ExecSyncOptions = {
      stdio: 'inherit',
      cwd: this.config.getProjectRoot(),
      ...options,
    };

    if (!options?.silent) {
      logger.info(`➡️  Running '${cmd.replace(/\s+/gi, ' ')}' with options ${JSON.stringify(_options)}`);
    }

    return childProcess.execSync(cmd, _options);
  }

  public async(cmd: string, options?: SpawnOptions & { silent?: boolean }): ChildProcess {
    const _options: SpawnOptions = {
      stdio: 'inherit',
      cwd: this.config.getProjectRoot(),
      ...options,
    };

    if (!options?.silent) {
      logger.info(`➡️  Spawning '${cmd.replace(/\s+/gi, ' ')}' with options ${JSON.stringify(_options)}`);
    }

    return childProcess.spawn('bash', ['-c', cmd], _options);
  }
}
