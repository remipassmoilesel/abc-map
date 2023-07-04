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
import { Command, CommandName } from './Command';

export class Parser {
  public parse(args: string[]): Command {
    const commandName = (args.length > 2 && args[2]) || undefined;
    switch (commandName) {
      case CommandName.INSTALL: {
        return { name: CommandName.INSTALL };
      }
      case CommandName.LINT: {
        return { name: CommandName.LINT };
      }
      case CommandName.BUILD: {
        return { name: CommandName.BUILD };
      }
      case CommandName.TEST: {
        return { name: CommandName.TEST };
      }
      case CommandName.E2E_TESTS: {
        return { name: CommandName.E2E_TESTS };
      }
      case CommandName.WATCH: {
        return { name: CommandName.WATCH };
      }
      case CommandName.CI: {
        const light = !!args.find((a) => a === '--light');
        return { name: CommandName.CI, light };
      }
      case CommandName.START: {
        return { name: CommandName.START };
      }
      case CommandName.START_SERVICES: {
        return { name: CommandName.START_SERVICES };
      }
      case CommandName.STOP_SERVICES: {
        return { name: CommandName.STOP_SERVICES };
      }
      case CommandName.CLEAN_RESTART_SERVICES: {
        return { name: CommandName.CLEAN_RESTART_SERVICES };
      }
      case CommandName.CLEAN: {
        return { name: CommandName.CLEAN };
      }
      case CommandName.DEPENDENCY_CHECK: {
        return { name: CommandName.DEPENDENCY_CHECK };
      }
      case CommandName.DOCKER_BUILD: {
        const repository = getDockerRepository(args);
        const tag = getDockerTag(args);
        return { name: CommandName.DOCKER_BUILD, repository, tag };
      }
      case CommandName.DOCKER_PUSH: {
        const repository = getDockerRepository(args);
        const tag = getDockerTag(args);
        return { name: CommandName.DOCKER_PUSH, repository, tag };
      }
      case CommandName.APPLY_LICENSE: {
        return { name: CommandName.APPLY_LICENSE };
      }
      case CommandName.DEPLOY: {
        const configPath = getConfigPath(args);
        const skipBuild = !!args.find((a) => a === '--skip-build');
        return { name: CommandName.DEPLOY, configPath, skipBuild };
      }
      case CommandName.HELP: {
        return { name: CommandName.HELP };
      }
      case CommandName.PERFORMANCE_TESTS: {
        return { name: CommandName.PERFORMANCE_TESTS };
      }
      default: {
        throw new Error('Invalid command, try $ ./abc-cli help');
      }
    }
  }
}

function getDockerRepository(args: string[]): string {
  if (args.length < 3 || !args[3]) {
    throw new Error("Repository is mandatory, e.g: 'gitlab.registry.com/abc-map-2'. See help for more details.");
  }
  return args[3];
}

function getDockerTag(args: string[]): string {
  if (args.length < 4 || !args[4]) {
    throw new Error("Tag is mandatory, e.g: '0.0.1'. See help for more details.");
  }
  return args[4];
}

function getConfigPath(args: string[]): string {
  if (args.length < 3 || !args[3]) {
    throw new Error("Config path is mandatory, e.g: '/path/to/config.js'. See help for more details.");
  }
  return args[3];
}
