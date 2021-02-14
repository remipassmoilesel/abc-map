import { Config } from './Config';
import { Shell } from './Shell';
import * as waitOn from 'wait-on';
import { Logger } from './Logger';

const logger = Logger.get('Service.ts', 'info');

export class Service {
  constructor(private config: Config, private shell: Shell) {}

  public bootstrap(): void {
    this.shell.sync('lerna bootstrap --force-local');
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
      const startCmd = this.shell.async('lerna run start:e2e --parallel');
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
          this.shell.sync('yarn run e2e-test:before-merge', { cwd: this.config.getE2eRoot() });
        })
        .catch(reject)
        .finally(() => startCmd.kill('SIGTERM'));
    });
  }

  public watch(): void {
    this.shell.sync('lerna run watch --parallel');
  }

  public start(): void {
    this.startServices();
    this.shell.sync('lerna run start:watch --parallel');
  }

  public startServices(): void {
    this.shell.sync('docker-compose up -d', { cwd: this.config.getDevServicesRoot() });
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

  public dependencyCheck(): void {
    this.shell.sync('lerna run dep-check');
  }

  public async continuousIntegration(): Promise<void> {
    const start = new Date().getTime();
    this.bootstrap();
    this.lint();
    this.cleanBuild();
    this.dependencyCheck(); // Dependency check must be launched AFTER build for local dependencies
    this.test();
    await this.e2e();
    const tookSec = Math.round((new Date().getTime() - start) / 1000);
    logger.info(`CI took ${tookSec} seconds`);
  }

  public help() {
    logger.info(`
Abc-CLI helps to build and deploy Abc-Map.

Common commands are:

  $ ./abc-cli bootstrap                  Init project and install dependencies.
  $ ./abc-cli watch                      Watch source code of all packages and compile on change.
  $ ./abc-cli start                      Start project and associated services (database, mail server, ...).
  $ ./abc-cli clean-restart-services     Stop services, clean data, then start services.


Other commands:

  $ ./abc-cli build             Build all packages.
  $ ./abc-cli lint              Analyse code with ESLint and fix things that can be fixed.
  $ ./abc-cli test              Test all packages.
  $ ./abc-cli e2e               Launch E2E tests.
  $ ./abc-cli start-services    Start associated services.
  $ ./abc-cli stop-services     Stop associated services.
  $ ./abc-cli clean             Clean all build directories and dependencies.
  $ ./abc-cli dep-check         Check dependencies and source code with Dependency Cruiser.
  $ ./abc-cli ci                Execute continuous integration: lint, dep-check, build, test, ...
  $ ./abc-cli help              Show this help.

    `);
  }
}
