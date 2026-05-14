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

import 'source-map-support/register.js';
import { Logger } from './tools/Logger.js';
import { Config } from './config/Config.js';
import { Parser } from './parser/Parser.js';
import type { CiServers } from './BuildService.js';
import { BuildService } from './BuildService.js';
import { Banners } from './tools/Banners.js';
import { CommandName } from './parser/Command.js';
import { Help } from './Help.js';

const logger = Logger.get('main.ts', 'info');

main(process.argv).catch((err) => {
  logger.error(err);
  process.exit(1);
});

async function main(args: string[]) {
  const config = new Config();
  const parser = new Parser();
  const service = BuildService.create(config);

  // We use node_modules bin from command line
  process.env.PATH = `${config.getCliRoot()}/node_modules/.bin/:${process.env.PATH}`;

  Banners.small();

  const command = parser.parse(args);

  switch (command.name) {
    case CommandName.CI: {
      service.printToolVersions();
      await service.continuousIntegration(command.light);
      Banners.bigDone();
      break;
    }

    case CommandName.INSTALL:
      service.install('development');
      break;

    case CommandName.LINT:
      service.writeVersions();
      service.lint(true);
      break;

    case CommandName.BUILD:
      service.writeVersions();
      service.build();
      break;

    case CommandName.DEPENDENCY_CHECK:
      service.writeVersions();
      service.dependencyCheck();
      break;

    case CommandName.TEST:
      service.unitTest();
      break;

    case CommandName.WATCH:
      service.watch();
      break;

    case CommandName.E2E_TESTS: {
      let servers: CiServers | undefined;
      try {
        servers = await service.startServersForCi();
        service.e2eTests();
      } finally {
        servers?.kill();
      }
      break;
    }

    case CommandName.START:
      service.startForDev();
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

    case CommandName.APPLY_LICENSE:
      service.applyLicense();
      break;

    case CommandName.DOCKER_BUILD:
      await service.dockerBuild(command.repository, command.tag);
      break;

    case CommandName.DOCKER_PUSH:
      await service.dockerPush(command.repository, command.tag);
      break;

    case CommandName.DEPLOY:
      await service.deploy(command.configPath, !command.skipBuild);
      break;

    case CommandName.HELP:
      Help.display();
      break;

    case CommandName.PERFORMANCE_TESTS: {
      let servers: CiServers | undefined;
      try {
        servers = await service.startServersForCi();
        service.performanceTests();
      } finally {
        servers?.kill();
      }
      break;
    }
  }
}
