import { Env, EnvKey } from './Env';
import { Config } from './Config';
import { Logger } from '../utils/Logger';
import { resolve } from 'path';
import { strict as assert } from 'assert';

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
    const config: Config = require(path);

    assert(config.environmentName);
    assert(config.server);
    assert(config.server.host);
    assert(config.server.port);
    assert(config.database);
    assert(config.database.url);
    assert(config.database.username);
    assert(config.database.password);

    return config;
  }
}
