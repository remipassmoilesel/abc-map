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

import { Config } from './config/Config';
import { Shell } from './tools/Shell';
import * as waitOn from 'wait-on';
import { Logger } from './tools/Logger';
import { Registry } from './tools/Registry';
import * as glob from 'fast-glob';
import * as path from 'path';
import { DockerConfig } from './config/DockerConfig';
import { DeployConfig } from './config/DeployConfig';

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
        const version = new Date().toISOString().replace(/[^a-z0-9]/gi, '-');
        this.shell.sync(`lerna publish --canary --yes \
                                            --preid '${version}' \
                                            --no-git-tag-version --no-push --no-git-reset \
                                            --registry ${registryUrl} \
                                            --force-publish`);

        // Here we must limit concurrency to prevent bad use of Yarn cache
        const installProduction = `YARN_REGISTRY="${registryUrl}" yarn install --production`;
        this.shell.sync(`lerna exec  --ignore e2e-tests --concurrency 1 '${installProduction}'`);

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
    this.shell.sync(`helm lint ${this.config.getChartRoot()}`);
  }

  public cleanBuild(): void {
    this.shell.sync('lerna run clean-build');

    logger.info('\nCopying frontend distribution to server ...\n');
    // Here we copy frontend build to public backend dir.
    // We could use frontend as a dependency but dependency management is messy afterwards (more than usual lol).
    const sourceDir = `${this.config.getFrontendRoot()}/build`;
    const targetDir = this.config.getBackendPublicRoot();
    this.shell.sync(`rm -rf ${targetDir}`);
    this.shell.sync(`cp -R ${sourceDir} ${targetDir}`);
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
    this.shell.sync('lerna exec "rm -rf .nyc_output"');
    this.shell.sync(`rm -rf ${this.config.getBackendPublicRoot()}`);
  }

  public dependencyCheck(): void {
    this.shell.sync('lerna run dep-check');
  }

  public applyLicense(): void {
    const header = `${this.config.getProjectRoot()}/license-header.txt`;
    const skip = `-skip 'js' -skip 'json' -skip 'yaml' -skip 'yml' -skip 'YAML'`;
    this.shell.sync(`addlicense -f ${header} ${skip} packages`);
  }

  public async startRegistry(logOutput: boolean): Promise<void> {
    const registry = await this.registry.start(logOutput);
    process.on('SIGINT', function () {
      logger.info('Stopping registry ...');
      registry.terminate();
    });
  }

  public dockerBuild(repository: string, tag: string): void {
    const images = this.getDockerConfigs();
    for (const image of images) {
      const fullName = `${repository}/${image.imageName}:${tag}`;
      this.shell.sync(`docker build ${image.root} -t ${fullName}`);
    }
  }

  public dockerPush(repository: string, tag: string): void {
    const images = this.getDockerConfigs();
    for (const image of images) {
      const fullName = `${repository}/${image.imageName}:${tag}`;
      this.shell.sync(`docker push ${fullName}`);
    }
  }

  public async deploy(configPath: string): Promise<void> {
    const start = Date.now();
    const config = this.loadDeployConfig(configPath);

    // Build
    logger.info('\n 🛠️  Building ... 🛠️\n');
    await this.install(Dependencies.Development);
    this.cleanBuild();

    // Package and push
    logger.info('\n 📦️ Packaging ... 🏋️‍♂️\n');
    await this.install(Dependencies.Production);
    this.dockerBuild(config.registry, config.tag);
    this.dockerPush(config.registry, config.tag);

    // Deploy
    this.shell.sync(`helm upgrade ${config.releaseName} ${this.config.getChartRoot()} \
                        --install \
                        --namespace ${config.namespace} \
                        --set abcMap.image.tag='${config.tag}' \
                        --values ${config.valuesFile} \
                        --wait`);

    logger.info(`Waiting for services readiness ...`);

    const options = {
      resources: [config.healthCheckUrl],
      timeout: 30_000,
    };
    await waitOn(options);

    const tookMin = Math.round((Date.now() - start) / 1000 / 60);
    logger.info(`Ready ! Deployment took ${tookMin} minutes,`);
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

  private getDockerConfigs(): DockerConfig[] {
    const packages = glob.sync('**/package.json', { cwd: this.config.getProjectRoot(), ignore: ['**/node_modules/**'] });
    return packages
      .map((p) => path.resolve(this.config.getProjectRoot(), p))
      .map((packagePath) => ({ packagePath, packageJson: require(packagePath) }))
      .filter((p) => !!p.packageJson.docker)
      .map((p) => {
        const image: DockerConfig = p.packageJson.docker;
        if (!image.imageName) {
          throw new Error(`Image name is mandatory in Docker config of package.json, directory ${p.packagePath}`);
        }
        return {
          ...image,
          root: path.dirname(p.packagePath),
        };
      });
  }

  private loadDeployConfig(configPath: string): DeployConfig {
    const _configPath = path.isAbsolute(configPath) ? configPath : path.resolve(process.cwd(), configPath);
    logger.info(`Loading deployment configuration: ${_configPath}`);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config: DeployConfig = require(_configPath);
    logger.info(JSON.stringify(config, null, 2));

    if (!config.releaseName) {
      throw new Error(`Release name is mandatory in configuration ${path}`);
    }

    if (!config.registry) {
      throw new Error(`Registry is mandatory in configuration ${path}`);
    }

    if (!config.tag) {
      throw new Error(`Tag is mandatory in configuration ${path}`);
    }

    if (!config.namespace) {
      throw new Error(`Namespace is mandatory in configuration ${path}`);
    }

    if (!config.valuesFile) {
      throw new Error(`Values file is mandatory in configuration ${path}`);
    }

    if (!config.healthCheckUrl) {
      throw new Error(`Health check URL is mandatory in configuration ${path}`);
    }

    return config;
  }
}
