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
import { Logger } from './tools/Logger';
import { Config } from './config/Config';
import { Shell } from './tools/Shell';
import { Parser } from './parser/Parser';
import { Dependencies, Service } from './Service';
import { Banners } from './tools/Banners';
import { Registry } from './tools/Registry';
import { CommandName } from './parser/Command';
import { Help } from './Help';

const logger = Logger.get('main.ts', 'info');

main(process.argv).catch((err) => {
  logger.error(err);
  process.exit(1);
});

async function main(args: string[]) {
  const banners = new Banners();
  const config = new Config();
  const shell = new Shell(config);
  const registry = new Registry(config, shell);
  const parser = new Parser();
  const service = new Service(config, registry, shell);

  // We use node_modules bin from command line
  process.env.PATH = `${process.env.PATH}:${config.getCliRoot()}/node_modules/.bin/`;

  banners.cli();
  const command = await parser.parse(args);

  switch (command.name) {
    case CommandName.INSTALL:
      await service.install(command.production ? Dependencies.Production : Dependencies.Development);
      break;

    case CommandName.LINT:
      service.lint();
      break;

    case CommandName.BUILD:
      service.cleanBuild();
      break;

    case CommandName.WATCH:
      service.watch();
      break;

    case CommandName.TEST:
      service.test();
      break;

    case CommandName.E2E:
      await service.e2e();
      break;

    case CommandName.CI:
      await service.continuousIntegration();
      banners.done();
      break;

    case CommandName.START:
      service.start();
      break;

    case CommandName.START_SERVICES:
      service.startServices();
      break;

    case CommandName.STOP_SERVICES:
      service.stopServices();
      break;

    case CommandName.CLEAN_RESTART_SERVICES:
      service.cleanRestartServices();
      break;

    case CommandName.CLEAN:
      service.clean();
      break;

    case CommandName.DEPENDENCY_CHECK:
      service.dependencyCheck();
      break;

    case CommandName.NPM_REGISTRY:
      await service.startRegistry(true);
      break;

    case CommandName.APPLY_LICENSE:
      await service.applyLicense();
      break;

    case CommandName.DOCKER_BUILD:
      service.dockerBuild(command.repository, command.tag);
      break;

    case CommandName.DOCKER_PUSH:
      service.dockerPush(command.repository, command.tag);
      break;

    case CommandName.DEPLOY:
      await service.deploy(command.configPath);
      break;

    case CommandName.HELP:
      banners.big();
      Help.display();
      break;
  }
}
