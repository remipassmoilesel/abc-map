import * as childProcess from 'child_process';
import { Config } from './Config';
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

    logger.info(`Running '${cmd}' with options ${JSON.stringify(_options)}`);
    childProcess.execSync(cmd, _options);
  }

  public async(cmd: string, options?: SpawnOptions): ChildProcess {
    const _options: SpawnOptions = {
      stdio: 'inherit',
      cwd: this.config.getProjectRoot(),
      ...options,
    };

    logger.info(`Spawning '${cmd}' with options ${JSON.stringify(_options)}`);
    return childProcess.spawn('bash', ['-c', cmd], _options);
  }
}
