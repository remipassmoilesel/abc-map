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

import { HttpClient } from './utils/HttpClient';
import { Logger } from './utils/Logger';
import { hasBinary } from './utils/hasBinary';
import * as chalk from 'chalk';
import * as path from 'path';
import * as AdmZip from 'adm-zip';
import * as sortPackageJson from 'sort-package-json';
import { promises as fs, Stats } from 'fs';
import { Shell } from './utils/Shell';
import { getErrorMessage } from './utils/getErrorMessage';

export const logger = Logger.get('Bootstrap.tsx');

export interface BootstrapParameters {
  name: string;
  sourceUrl: string;
  destination: string;
}

export class Bootstrap {
  public static create(params: BootstrapParameters) {
    return new Bootstrap(params, new HttpClient(), new Shell());
  }

  constructor(private params: BootstrapParameters, private client: HttpClient, private shell: Shell) {}

  public async start(): Promise<void> {
    // Check if all prerequisites are present
    await this.checkPrerequisites();

    // Download template in memory, then unzip it
    await this.expandTemplate();

    // Download template in memory, then unzip it
    await this.adaptTemplate();

    // Git init if git command found
    await this.gitInit();

    // Install template dependencies
    this.installTemplate();
  }

  private async checkPrerequisites(): Promise<void> {
    if (!(await hasBinary('yarn'))) {
      logger.error(chalk.red('Missing prerequisites'));
      logger.error('You must install yarn, try this command: npm install --global yarn');
      logger.error('See: https://yarnpkg.com/');
      throw new Error('yarn is missing');
    }
  }

  private async expandTemplate() {
    // Download template
    let template: Buffer;
    try {
      template = await this.client.getArchive(this.params.sourceUrl);
    } catch (err) {
      logger.error(chalk.red(`Cannot download template at location: ${this.params.sourceUrl}`));
      throw err;
    }

    const root = this.getRoot();
    // Check if root directory does not exist
    let stats: Stats | undefined = undefined;
    try {
      stats = await fs.stat(root);
      // eslint-disable-next-line no-empty
    } catch (err) {}

    if (stats?.isDirectory()) {
      logger.error(chalk.red(`'${this.params.name}' already exists. Choose a different name.`));
      throw new Error('Root already exists');
    }

    // Create root directory
    try {
      await fs.mkdir(root, { recursive: true });
    } catch (err) {
      logger.error(chalk.red(`Cannot create directory ${root}`));
      logger.error('Does it exist ?');
      throw err;
    }

    // Unzip template
    const zip = new AdmZip(template);
    const fileOperations: Promise<unknown>[] = [];
    const entries = zip.getEntries();
    for (const entry of entries) {
      const pathPaths = entry.entryName.split(path.sep).filter((p) => !!p);

      // We do not process the zip root
      if (pathPaths.length <= 1) {
        continue;
      }

      const targetPath = path.join(root, pathPaths.slice(1).join(path.sep));

      // Entry is dir, we create it and wait
      if (entry.isDirectory) {
        await fs.mkdir(targetPath);
        continue;
      }

      // Entry is file, we create it
      fileOperations.push(fs.writeFile(targetPath, entry.getData()));
    }

    return Promise.all(fileOperations);
  }

  private async adaptTemplate() {
    // Read package.json
    const root = this.getRoot();
    const packageJsonPath = path.resolve(root, 'package.json');
    const packageJson = JSON.parse((await fs.readFile(packageJsonPath)).toString('utf-8'));

    // Adapt parameters
    packageJson.name = this.params.name;
    packageJson.license = 'UNLICENSED';
    delete packageJson.author;

    // Write then sort
    let packageJsonString = JSON.stringify(packageJson, null, 2);
    packageJsonString = sortPackageJson(packageJsonString);
    await fs.writeFile(packageJsonPath, packageJsonString);
  }

  private async gitInit() {
    if (!(await hasBinary('git'))) {
      logger.warn('git binary not found, skipping git initialization');
      return;
    }

    const root = this.getRoot();

    try {
      this.shell.sync('git init', { cwd: root, stdio: 'ignore' });
      this.shell.sync('git add -A', { cwd: root, stdio: 'ignore' });
      this.shell.sync('git commit -m "Add template 🚀"', { cwd: root, stdio: 'ignore' });
    } catch (err) {
      logger.error('git init error: ', getErrorMessage(err));
      logger.error('You may have to configure git.');
      logger.debug('git init error: ', err);
    }
  }

  private installTemplate() {
    logger.info(chalk.green('Installing template dependencies, this may take a while ⌛\n'));

    const root = this.getRoot();
    this.shell.sync('yarn', { cwd: root });
  }

  private getRoot(): string {
    return path.join(this.params.destination, this.params.name);
  }
}
