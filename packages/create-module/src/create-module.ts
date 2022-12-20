#!/usr/bin/env node
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

import 'source-map-support/register';
import { Logger } from './utils/Logger';
import { Bootstrap } from './Bootstrap';
import * as commandLineArgs from 'command-line-args';
import * as chalk from 'chalk';

const level = process.env.ABC_CREATE_MODULE_DEBUG ? 'debug' : 'info';
const logger = Logger.get('index.ts', level);

createModule().catch((err) => {
  logger.error('An error occured, see https://gitlab.com/abc-map/abc-map/-/tree/master/documentation for more informations.');
  logger.debug('Error: ', err);
  process.exit(1);
});

async function createModule() {
  const options = commandLineArgs([{ name: 'name', alias: 'n', type: String }]);
  const name = options.name || 'my-awesome-module';

  const defaultSourceUrl = 'https://gitlab.com/abc-map/module-template/-/archive/master/module-template-master.zip';
  const sourceUrl = process.env.ABC_CREATE_MODULE_SOURCE_URL ?? defaultSourceUrl;

  logger.info(`\nBootstraping module ${chalk.blue(name)} 🌍\n`);

  const bootstrap = Bootstrap.create({
    name,
    sourceUrl,
    destination: process.cwd(),
  });

  await bootstrap.start();

  logger.info(`\

That's done ✌️

You can now start your module using these commands:

    ${chalk.blue(`$ cd ${name}`)}
    ${chalk.blue('$ yarn dev')}

  `);
}
