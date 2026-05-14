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

import { EnvironmentHelper, EnvironmentVariable } from './EnvironmentHelper.js';
import type { Config, ConfigInput } from './Config.js';
import { errorMessage, Logger } from '@abc-map/shared';
import path from 'path';
import { Validation } from '../utils/Validation.js';
import { isDirectory } from '../utils/isDirectory.js';
import { sampleConfig } from './sampleConfig.js';
import { isDeprecatedConfig } from './isDeprecatedConfig.js';
import { ResourceHelper } from '../utils/ResourceHelper.js';
import _ from 'lodash';
import ms from 'ms';

const logger = Logger.get('ConfigLoader.ts', 'info');

export function disableConfigLoaderLogger() {
  logger.disable();
}

export type LoadConfigFunc = () => Promise<Config>;

const Resources = new ResourceHelper();
const Environment = new EnvironmentHelper();

export class ConfigLoader {
  public static readonly DEFAULT_CONFIG_PATH = Resources.getResourcePath('configuration/development.mjs');

  public static getPathFromEnv(): string {
    return Environment.get(EnvironmentVariable.CONFIG_PATH) || ConfigLoader.DEFAULT_CONFIG_PATH;
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

  public static async load(pathArg: string | undefined = undefined): Promise<Config> {
    const _configPath = path.resolve(pathArg ?? ConfigLoader.getPathFromEnv());

    const explainedError = (message: string) => {
      logger.error(
        [
          '',
          '',
          '⚠️   Invalid configuration. ',
          '',
          'Message: ' + message,
          '',
          'This is a valid configuration example:',
          '',
          '------ config.mjs ------',
          sampleConfig()
            .split('\n')
            .map((line) => '   ' + line)
            .join('\n'),
          '------ config.mjs ------',
          '',
          'You can see other examples here: https://gitlab.com/abc-map/abc-map/-/tree/master/packages/server/resources/configuration',
          '',
          '',
        ].join('\n'),
      );
    };

    let input: ConfigInput;
    try {
      if (await isDeprecatedConfig(_configPath)) {
        throw new Error('This config format has been deprecated. Replace "module.exports" by "export default". See full example below.');
      }

      input = await import(_configPath).then((mod) => mod.default);
    } catch (err) {
      explainedError(errorMessage(err));
      return Promise.reject(new Error(`Cannot load configuration ${_configPath}: ${errorMessage(err)}`));
    }

    // We validate config input
    if (!Validation.ConfigInput(input)) {
      explainedError(Validation.formatErrors(Validation.ConfigInput));
      return Promise.reject(new Error(`Configuration ${_configPath} is not valid: ${Validation.formatErrors(Validation.ConfigInput)}`));
    }

    const publicDir = path.resolve(import.meta.dirname, '../../public/');
    const config: Config = {
      ...input,
      webappPath: path.resolve(publicDir, 'webapp'),
      userDocumentationPath: path.resolve(publicDir, 'user-documentation'),
      pointIconsPath: path.resolve(publicDir, 'point-icons'),
    };

    // We check if datastore is a directory
    if (!(await isDirectory(config.datastore.path))) {
      throw new Error(`Datastore root '${config.datastore.path}' must be a directory`);
    }

    // We remove trailing slash if present
    config.externalUrl = config.externalUrl.trim();
    if (config.externalUrl.slice(-1) === '/') {
      config.externalUrl = config.externalUrl.slice(0, -1);
    }

    // We check if webapp path is a directory
    if (!(await isDirectory(config.webappPath))) {
      throw new Error(`Webapp root '${config.webappPath}' must be a directory. Try "abc build" on a developer workstation.`);
    }

    const msValues = [
      { name: 'config.authentication.tokenExpiresIn', value: config.authentication.tokenExpiresIn },
      { name: 'config.registration.confirmationExpiresIn', value: config.registration.confirmationExpiresIn },
      { name: 'config.authentication.passwordLostExpiresIn', value: config.authentication.passwordLostExpiresIn },
    ];

    const msErrors = msValues.filter((v) => ms(v.value) === undefined);
    if (msErrors.length > 0) {
      throw new Error("Some time values are incorrect, you should use a string in minutes or second, e.g. '15m' or '30s': " + JSON.stringify(msErrors));
    }

    return config;
  }
}
