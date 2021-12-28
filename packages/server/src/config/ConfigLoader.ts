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

import { Env, EnvKey } from './Env';
import { Config, ConfigInput } from './Config';
import { Logger, messageFromError } from '@abc-map/shared';
import * as path from 'path';
import * as _ from 'lodash';
import * as fs from 'fs';
import { Validation } from '../utils/Validation';

const logger = Logger.get('ConfigLoader.ts', 'info');

export class ConfigLoader {
  public static readonly DEFAULT_CONFIG = 'resources/configuration/local.js';

  public static getPathFromEnv(): string {
    const env = new Env();
    return env.get(EnvKey.CONFIG) || ConfigLoader.DEFAULT_CONFIG;
  }

  public static async load(): Promise<Config> {
    const configPath = this.getPathFromEnv();
    return new ConfigLoader().load(configPath);
  }

  public static safeConfig(config: Config): Config {
    const safe: Config = _.cloneDeep(config);
    const safeValue = '<value-masked>';
    safe.authentication.secret = safeValue;
    safe.database.password = safeValue;
    safe.registration.passwordSalt = safeValue;
    safe.registration.secret = safeValue;
    if (safe.smtp.auth?.pass) {
      safe.smtp.auth.pass = safeValue;
    }

    safe.legalMentions = `${safe.legalMentions.substring(0, 50)}...`;

    return safe;
  }

  public async load(configPath: string): Promise<Config> {
    const _configPath = path.resolve(configPath);
    let input: ConfigInput;
    try {
      /* eslint-disable @typescript-eslint/no-var-requires */
      input = _.cloneDeep(require(_configPath));
    } catch (e) {
      return Promise.reject(new Error(`Cannot load configuration '${configPath}': '${messageFromError(e)}'`));
    }

    // We validate config input
    if (!Validation.ConfigInput(input)) {
      return Promise.reject(new Error(`Invalid configuration: ${Validation.formatErrors(Validation.ConfigInput)}`));
    }

    const config: Config = {
      ...input,
      frontendPath: path.resolve(__dirname, '..', '..', 'public'),
    };

    // We check if datastore is a directory
    if (!this.isDir(config.datastore.path)) {
      throw new Error(`Datastore root '${config.datastore.path}' must be a directory`);
    }

    // We remove trailing slash if present
    config.externalUrl = config.externalUrl.trim();
    if (config.externalUrl.slice(-1) === '/') {
      config.externalUrl = config.externalUrl.slice(0, -1);
    }

    // We check if frontend path is a directory
    if (!this.isDir(config.frontendPath)) {
      throw new Error(`Frontend root '${config.frontendPath}' must be a directory`);
    }

    return config;
  }

  private isDir(path: string): boolean {
    return fs.existsSync(path) && fs.statSync(path).isDirectory();
  }
}
