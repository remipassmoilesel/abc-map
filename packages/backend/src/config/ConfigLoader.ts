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
import { Config } from './Config';
import { Logger } from '../utils/Logger';
import * as path from 'path';
import * as _ from 'lodash';
import { promises as fs } from 'fs';

/* eslint-disable @typescript-eslint/no-var-requires */

const logger = Logger.get('ConfigLoader.ts', 'info');

export class ConfigLoader {
  public static readonly DEFAULT_CONFIG = 'resources/configuration/local.js';
  private static _cache: { [k: string]: Config } = {};

  public static async load(): Promise<Config> {
    const env = new Env();
    const configPath = env.get(EnvKey.CONFIG) || ConfigLoader.DEFAULT_CONFIG;
    if (!this._cache[configPath]) {
      this._cache[configPath] = await new ConfigLoader().load(configPath);
    }
    return this._cache[configPath];
  }

  public static safeConfig(config: Config): Config {
    const safe: Config = _.cloneDeep(config);
    const safeValue = '<value-masked>';
    safe.authentication.jwtSecret = safeValue;
    safe.authentication.passwordSalt = safeValue;
    safe.database.password = safeValue;
    safe.registration.confirmationSalt = safeValue;
    if (safe.smtp.auth?.pass) {
      safe.smtp.auth.pass = safeValue;
    }

    return safe;
  }

  public async load(configPath: string): Promise<Config> {
    if (!path.isAbsolute(configPath)) {
      configPath = path.resolve(configPath);
    }
    logger.info(`Loading configuration: ${configPath}`);

    const config: Config = _.cloneDeep(require(configPath));

    // TODO: use better validation, see https://github.com/colinhacks/zod
    const parameters: string[] = [
      'environmentName',
      'externalUrl',
      'server',
      'server.host',
      'server.port',
      'database',
      'database.url',
      'database.username',
      'database.password',
      'authentication',
      'authentication.passwordSalt',
      'authentication.jwtSecret',
      'authentication.jwtAlgorithm',
      'authentication.jwtExpiresIn',
      'registration',
      'registration.confirmationSalt',
      'smtp',
      'smtp.host',
      'smtp.port',
      'datastore',
      'datastore.path',
    ];

    parameters.forEach((param) => {
      const value = _.get(config, param);
      if (typeof value === 'undefined') {
        throw new Error(`Missing parameter ${param} in configuration`);
      }
    });

    if (!(await fs.stat(config.datastore.path)).isDirectory()) {
      throw new Error(`Datastore root '${config.datastore.path}' must be a directory`);
    }

    // We remove trailing slash if present
    config.externalUrl = config.externalUrl.trim();
    if (config.externalUrl.slice(-1) === '/') {
      config.externalUrl = config.externalUrl.slice(0, -1);
    }

    // We set resolve and set frontend path
    config.frontendPath = path.resolve(__dirname, '..', '..', 'public');

    logger.info(`Loaded !`);
    return config;
  }
}
