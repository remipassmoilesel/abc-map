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
import { Parser } from './parser/Parser';
import { BuildService, Dependencies } from './BuildService';
import { Banners } from './tools/Banners';
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
  const parser = new Parser();
  const service = BuildService.create(config);

  // We use node_modules bin from command line
  process.env.PATH = `${config.getCliRoot()}/node_modules/.bin/:${process.env.PATH}`;

  banners.cli();
  const command = parser.parse(args);

  switch (command.name) {
    case CommandName.CI: {
      await service.continuousIntegration(command.light);
      banners.bigDone();
      break;
    }

    case CommandName.INSTALL:
      await service.install(command.production ? Dependencies.Production : Dependencies.Development);
      break;

    case CommandName.LINT:
      service.version();
      service.lint(true);
      break;

    case CommandName.BUILD:
      service.version();
      service.cleanBuild();
      break;

    case CommandName.DEPENDENCY_CHECK:
      service.version();
      service.dependencyCheck();
      break;

    case CommandName.TEST:
      service.test();
      break;

    case CommandName.WATCH:
      service.watch();
      break;

    case CommandName.E2E_TESTS: {
      const servers = await service.startServers();
      try {
        service.e2eTests();
      } finally {
        servers.kill('SIGTERM');
      }
      break;
    }

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

    case CommandName.NPM_REGISTRY:
      await service.startRegistry(true);
      break;

    case CommandName.APPLY_LICENSE:
      service.applyLicense();
      break;

    case CommandName.DOCKER_BUILD:
      service.dockerBuild(command.repository, command.tag);
      break;

    case CommandName.DOCKER_PUSH:
      service.dockerPush(command.repository, command.tag);
      break;

    case CommandName.DEPLOY:
      await service.deploy(command.configPath, !command.skipBuild);
      break;

    case CommandName.HELP:
      banners.big();
      Help.display();
      break;

    case CommandName.PERFORMANCE_TESTS: {
      const servers = await service.startServers();
      try {
        service.performanceTests();
      } finally {
        servers.kill('SIGTERM');
      }
      break;
    }
  }
}
