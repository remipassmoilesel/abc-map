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

import type { Config } from './config/Config.js';
import { Shell } from './tools/Shell.js';
import waitOn from 'wait-on';
import { Logger } from './tools/Logger.js';
import glob from 'fast-glob';
import path from 'path';
import type { DockerConfig } from './config/DockerConfig.js';
import type { DeployConfig } from './config/DeployConfig.js';
import { Git } from './tools/Git.js';
import { errorMessage } from './tools/errorMessage.js';
import fs from 'fs/promises';

const logger = Logger.get('Service.ts', 'info');

export interface CiServers {
  kill: () => void;
}

export class BuildService {
  public static create(config: Config) {
    const shell = new Shell(config);
    return new BuildService(config, shell, Git.create(config));
  }

  constructor(
    private config: Config,
    private shell: Shell,
    private git: Git,
  ) {}

  public async continuousIntegration(light: boolean) {
    const start = new Date().getTime();

    this.install('development');
    this.writeVersions();
    this.lint(false);
    this.build();
    this.dependencyCheck(); // Dependency check must be launched AFTER build for local dependencies
    this.unitTest();

    if (light) {
      logger.info('\n\nThis is a light pipeline, end to end tests will not be executed.\n\n');
      return;
    }

    let servers: CiServers | undefined;
    try {
      servers = await this.startServersForCi();
      this.shell.sync('turbo run test:with-servers --concurrency 1');
    } finally {
      servers?.kill();
    }

    const tookSec = Math.round((new Date().getTime() - start) / 1000);
    logger.info(`CI took ${tookSec} seconds`);
  }

  public install(type: 'development' | 'production'): void {
    const flag = type === 'production' ? '--prod -f' : '';
    this.shell.sync(`pnpm install ${flag}`);
  }

  public lint(fix: boolean): void {
    const lintTask = fix ? 'lint:fix' : 'lint';
    this.shell.sync(`turbo run ${lintTask}`);

    if (!fix) {
      try {
        this.shell.sync('git diff --exit-code');
      } catch (err) {
        throw new Error('Changes not committed, you should probably run "./abc-cli lint" then commit result. Underlying error: ' + errorMessage(err));
      }
    }
  }

  // Write git versions in concerned packages
  public writeVersions(): void {
    this.shell.sync('turbo run write-version');
  }

  public build(): void {
    this.shell.sync('turbo run clean-build --concurrency 1');
    this.shell.sync('turbo run package --concurrency 1');
  }

  public unitTest(): void {
    this.shell.sync('turbo run test --concurrency 1');
  }

  public e2eTests(): void {
    this.shell.sync('turbo run test:with-servers --concurrency 1', { cwd: this.config.getE2eRoot() });
  }

  public performanceTests(): void {
    this.shell.sync('turbo run test:with-servers --concurrency 1', { cwd: this.config.getPerformanceTestsRoot() });
  }

  /**
   * Start server and associated service for testing purposes.
   *
   * Services should start in the closest possible conditions to production.
   */
  public startServersForCi(): Promise<CiServers> {
    return new Promise((resolve, reject) => {
      const startCmd = this.shell.async('turbo run start:ci --parallel');
      startCmd.on('error', reject);

      const debug = process.env.DEBUG === 'true';
      const options: waitOn.WaitOnOptions = {
        resources: [this.config.getBackendUrl(), this.config.getFrontendUrl()],
        timeout: 30_000,
        log: debug,
        verbose: debug,
      };
      const servers: CiServers = { kill: () => startCmd.kill() };

      waitOn(options)
        .then(() => {
          logger.info('Servers ready !');
          resolve(startCmd);
          resolve(servers);
        })
        .catch((err) => {
          try {
            servers.kill();
          } finally {
            reject(err);
          }
        });
    });
  }

  public watch(): void {
    this.shell.sync('turbo run watch --concurrency 20');
  }

  public startForDev(): void {
    this.startServices();
    this.shell.sync('turbo run start --concurrency 20');
  }

  public startServices(): void {
    this.shell.sync('docker compose up -d', { cwd: this.config.getDevServicesRoot() });
  }

  public stopServices(): void {
    this.shell.sync('docker compose down', { cwd: this.config.getDevServicesRoot() });
  }

  public cleanRestartServices(): void {
    this.shell.sync('docker compose down -v && docker compose up -d', { cwd: this.config.getDevServicesRoot() });
  }

  public clean(): void {
    this.shell.sync('turbo run clean');
    this.shell.sync('pnpm --recursive --shell-mode exec "rm -rf .nyc_output"');
    this.shell.sync('pnpm --recursive --shell-mode exec "rm -rf coverage"');
    this.shell.sync('pnpm --recursive --shell-mode exec "rm -rf .turbo"');

    // This must be the last command, as turbo will not be available anymore after
    this.shell.sync('pnpm --recursive --shell-mode exec "rm -rf node_modules"');
    this.shell.sync('rm -rf node_modules');
    this.shell.sync('rm -rf .turbo');
  }

  public dependencyCheck(): void {
    this.shell.sync('turbo run dependency-check');
  }

  public applyLicense(): void {
    const header = `${this.config.getProjectRoot()}/license-header.txt`;
    const skip = `-skip 'js' -skip 'json' -skip 'yaml' -skip 'yml' -skip 'YAML' -skip 'policy.xml'`;
    this.shell.sync(`addlicense -f ${header} ${skip} packages`);
  }

  public async dockerBuild(repository: string, tag: string): Promise<void> {
    const images = await this.getDockerConfigs();
    for (const image of images) {
      const fullName = `${repository}/${image.imageName}:${tag}`;
      this.shell.sync(`docker build . -f ${path.join(image.root, 'Dockerfile')} -t ${fullName}`, { cwd: this.config.getProjectRoot() });
    }
  }

  public async dockerPush(repository: string, tag: string): Promise<void> {
    const images = await this.getDockerConfigs();
    for (const image of images) {
      const fullName = `${repository}/${image.imageName}:${tag}`;
      this.shell.sync(`docker push ${fullName}`);
    }
  }

  public async deploy(configPath: string, buildImages: boolean): Promise<void> {
    const start = Date.now();
    const config = await this.loadDeployConfig(configPath);

    if (this.git.isRepoDirty()) {
      throw new Error('Repository is dirty, deployment canceled.');
    }

    // Build images
    if (buildImages) {
      logger.info('\n 🛠️  Building ... 🛠️\n');
      this.install('development');
      this.writeVersions();
      this.build();

      // Package and push
      logger.info('\n 📦️ Packaging ... 🏋️‍♂️\n');
      await this.dockerBuild(config.registry, config.tag);
      await this.dockerPush(config.registry, config.tag);
    } else {
      logger.info('\n⏩️ Skipping build. More time for 🍺️\n');
    }

    // Deploy
    this.shell.sync(`helm upgrade ${config.releaseName} ${this.config.getChartRoot()} \
                        --install \
                        --namespace ${config.namespace} \
                        --values ${config.valuesFile} \
                        --set abcMap.image.repository='${config.registry}/server',abcMap.image.tag='${config.tag}' \
                        --wait`);

    logger.info(`Waiting for services readiness ...`);

    const tookMin = Math.round((Date.now() - start) / 1000 / 60);
    logger.info(`Ready ! Deployment took ${tookMin} minutes.`);
  }

  private async getDockerConfigs(): Promise<DockerConfig[]> {
    const packages = await Promise.all(
      this.getPackagesPaths().map((packagePath) =>
        fs
          .readFile(packagePath)
          .then((content) => {
            return { packagePath, packageJson: JSON.parse(content.toString('utf-8')) };
          })
          .catch((err) => {
            throw new Error(`Cannot parse file ${packagePath}: ${errorMessage(err)}`);
          }),
      ),
    );

    return packages
      .filter((pkg) => !!pkg.packageJson.docker)
      .map((pkg) => {
        const image: DockerConfig = pkg.packageJson.docker;
        if (!image.imageName) {
          throw new Error(`Image name is mandatory in Docker config of package.json, directory ${pkg.packagePath}`);
        }
        return {
          ...image,
          root: path.dirname(pkg.packagePath),
        };
      });
  }

  private getPackagesPaths(): string[] {
    const packages = glob.sync('**/package.json', {
      cwd: this.config.getProjectRoot(),
      ignore: ['**/node_modules/**', '**/notes/**'],
    });
    return packages.map((paths) => path.resolve(this.config.getProjectRoot(), paths));
  }

  private async loadDeployConfig(configPath: string): Promise<DeployConfig> {
    const _configPath = path.isAbsolute(configPath) ? configPath : path.resolve(process.cwd(), configPath);
    logger.info(`Loading deployment configuration: ${_configPath}`);

    const config: DeployConfig = await import(_configPath).then((m) => m.default);
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

    return config;
  }

  public printToolVersions() {
    this.shell.sync('node -v');
    this.shell.sync('pnpm -v');
    this.shell.sync('npm -v');
  }
}
