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

import { Config } from './Config';
import { Shell } from './tools/Shell';
import * as waitOn from 'wait-on';
import { Logger } from './tools/Logger';
import { Registry } from './tools/Registry';
import { customAlphabet } from 'nanoid';
const versionId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

const logger = Logger.get('Service.ts', 'info');

export enum Dependencies {
  Development = 'Development',
  Production = 'Production',
}

export class Service {
  constructor(private config: Config, private registry: Registry, private shell: Shell) {}

  public async install(dependencies = Dependencies.Development): Promise<void> {
    // Local dependencies.
    // For development purposes. We use default npm registry and local packages as symlinks.
    if (Dependencies.Development === dependencies) {
      this.shell.sync(`lerna bootstrap --force-local`);
      return;
    }

    // Production dependencies.
    // We use a local registry and we publish then install a canary version.
    const registryUrl = this.config.registryUrl();
    const registry = await this.registry.start();
    return new Promise((resolve, reject) => {
      registry.onError(reject);
      try {
        // Even if canary publish is supposed to use unique versions, it does not work in every cases. So we use a pre id.
        this.shell.sync(`lerna publish --canary --yes \
                                            --preid '${versionId()}' \
                                            --no-git-tag-version --no-push --no-git-reset \
                                            --registry ${registryUrl}`);

        // Here we must limit concurrency to prevent bad use of Yarn cache
        this.shell.sync(`lerna exec  --ignore e2e-tests --concurrency 1 'YARN_REGISTRY="${registryUrl}" yarn install --production'`);

        resolve();
      } catch (err) {
        reject(err);
      } finally {
        registry.terminate();
      }
    });
  }

  public lint(): void {
    this.shell.sync('lerna run lint');
  }

  public cleanBuild(): void {
    this.shell.sync('lerna run clean-build');

    // Here we copy frontend build to public backend dir.
    // We could use frontend as a dependency but dependency management is messy afterwards (more than usual lol).
    const sourceDir = `${this.config.getFrontendRoot()}/build`;
    const publicDir = `${this.config.getBackendRoot()}/public`;
    this.shell.sync(`rm -rf ${publicDir}`);
    this.shell.sync(`cp -R ${sourceDir} ${publicDir}`);
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
          reject(new Error(`Command failed with code ${code}: ${JSON.stringify(startCmd.spawnargs)}`));
        }
      });

      logger.info('Waiting for development servers ...');

      const options = {
        resources: [this.config.getBackendE2eUrl(), this.config.getFrontendE2eUrl()],
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

  public applyLicense(): void {
    this.shell.sync(`addlicense -f ${this.config.getProjectRoot()}/license-header.txt \
                              -skip 'js' -skip 'json' -skip 'yaml' -skip 'yml' -skip 'YAML' \
                              packages`);
  }

  public async startRegistry(logOutput: boolean): Promise<void> {
    const registry = await this.registry.start(logOutput);
    process.on('SIGINT', function () {
      logger.info('Stopping registry ...');
      registry.terminate();
    });
  }

  public async continuousIntegration(): Promise<void> {
    const start = new Date().getTime();
    await this.install(Dependencies.Development);
    this.lint();
    this.cleanBuild();
    this.dependencyCheck(); // Dependency check must be launched AFTER build for local dependencies
    this.test();
    await this.install(Dependencies.Production);
    await this.e2e();
    await this.install(Dependencies.Development); // We reinstall for caching purposes

    const tookSec = Math.round((new Date().getTime() - start) / 1000);
    logger.info(`CI took ${tookSec} seconds`);
  }

  public help() {
    logger.info(`
Abc-CLI helps to build and deploy Abc-Map.

Common commands are:

  $ ./abc-cli install                    Init project and install dependencies.
  $ ./abc-cli build                      Build all packages. Generally needed once only.
  $ ./abc-cli watch                      Watch source code of all packages and compile on change.
  $ ./abc-cli start                      Start project and associated services (database, mail server, ...).
  $ ./abc-cli clean-restart-services     Stop services, clean data, then start services.


Other commands:

  $ ./abc-cli install                     Init project and install dependencies.
  $ ./abc-cli lint                        Analyse code with ESLint and fix things that can be fixed.
  $ ./abc-cli dep-check                   Check dependencies and source code with Dependency Cruiser.
  $ ./abc-cli build                       Build all packages.
  $ ./abc-cli test                        Test all packages.
  $ ./abc-cli e2e                         Launch E2E tests.
  $ ./abc-cli start-services              Start associated services.
  $ ./abc-cli stop-services               Stop associated services.
  $ ./abc-cli clean-restart-services      Stop associated services.
  $ ./abc-cli clean                       Clean all build directories and dependencies.
  $ ./abc-cli ci                          Execute continuous integration: lint, dep-check, build, test, ...
  $ ./abc-cli npm-registry                Start a local NPM registry
  $ ./abc-cli apply-license               Apply license to project files. Use: https://github.com/google/addlicense.
  $ ./abc-cli help                        Show this help.

    `);
  }
}
