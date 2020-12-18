import { Env, EnvKey } from './Env';
import { Config } from './Config';
import { Logger } from '../utils/Logger';
import { resolve } from 'path';
import * as _ from 'lodash';

const logger = Logger.get('ConfigLoader.ts', 'info');

export class ConfigLoader {
  public static readonly DEFAULT_CONFIG = 'resources/local/config';
  private static _cache?: Config;

  public static create(): ConfigLoader {
    return new ConfigLoader(new Env());
  }

  public static async load(): Promise<Config> {
    if (!this._cache) {
      this._cache = await new ConfigLoader(new Env()).load();
    }
    return this._cache;
  }

  constructor(private env: Env) {}

  public async load(): Promise<Config> {
    const path = resolve(this.env.get(EnvKey.CONFIG) || ConfigLoader.DEFAULT_CONFIG);
    logger.info(`Loading configuration: ${path}`);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config: Config = _.cloneDeep(require(path));

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
    ];

    parameters.forEach((param) => {
      const value = _.get(config, param);
      if (typeof value === 'undefined') {
        throw new Error(`Missing parameter ${param} in configuration`);
      }
    });

    // We remove trailing slash if present
    config.externalUrl = config.externalUrl.trim();
    if (config.externalUrl.slice(-1) === '/') {
      config.externalUrl = config.externalUrl.slice(0, -1);
    }

    logger.info(`Loaded !`);
    return config;
  }
}
