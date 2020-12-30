import { Config } from './Config';
import { Shell } from './Shell';
import * as waitOn from 'wait-on';
import { Logger } from './Logger';

const logger = Logger.get('Service.ts', 'info');

export class Service {
  constructor(private config: Config, private shell: Shell) {}

  public bootstrap(): void {
    this.shell.sync('lerna bootstrap');
  }

  public lint(): void {
    this.shell.sync('lerna run lint');
  }

  public cleanBuild(): void {
    this.shell.sync('lerna run clean-build');
  }

  public test(): void {
    this.shell.sync('lerna run test');
  }

  public async e2e(): Promise<void> {
    return new Promise((resolve, reject) => {
      const startCmd = this.shell.async('lerna run start:e2e --parallel --no-bail');
      startCmd.on('error', reject);
      startCmd.on('exit', (code) => {
        if (!code) {
          resolve();
        } else {
          reject(new Error(`Command failed: ${JSON.stringify(startCmd.spawnargs)}`));
        }
      });

      logger.info('Waiting for development servers ...');

      const options = {
        resources: [this.config.getBackendHealthUrl(), this.config.getFrontendHealthUrl()],
        timeout: 30_000,
      };
      waitOn(options)
        .then(() => {
          logger.info('Servers ready !');
          this.shell.sync('yarn run e2e-test', { cwd: this.config.getE2eRoot() });
        })
        .catch(reject)
        .finally(() => startCmd.kill('SIGTERM'));
    });
  }

  public watch(): void {
    this.shell.sync('lerna run watch --parallel');
  }

  public start(): void {
    this.shell.sync('docker-compose up -d', { cwd: this.config.getDevServicesRoot() });
    this.shell.sync('lerna run start:watch --parallel --no-bail');
  }

  public stopServices(): void {
    this.shell.sync('docker-compose down', { cwd: this.config.getDevServicesRoot() });
  }

  public cleanRestartServices(): void {
    this.shell.sync('docker-compose down -v && docker-compose up -d', { cwd: this.config.getDevServicesRoot() });
  }

  public clean(): void {
    this.shell.sync('lerna exec "rm -rf node_modules"');
    this.shell.sync('lerna exec "rm -rf build"');
  }
}
