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

import { Command } from './Command';

export class Parser {
  public async parse(args: string[]): Promise<Command> {
    if (matchCommand(args, Command.INSTALL)) {
      return Command.INSTALL;
    } else if (matchCommand(args, Command.LINT)) {
      return Command.LINT;
    } else if (matchCommand(args, Command.BUILD)) {
      return Command.BUILD;
    } else if (matchCommand(args, Command.TEST)) {
      return Command.TEST;
    } else if (matchCommand(args, Command.E2E)) {
      return Command.E2E;
    } else if (matchCommand(args, Command.WATCH)) {
      return Command.WATCH;
    } else if (matchCommand(args, Command.CI)) {
      return Command.CI;
    } else if (matchCommand(args, Command.START)) {
      return Command.START;
    } else if (matchCommand(args, Command.START_SERVICES)) {
      return Command.START_SERVICES;
    } else if (matchCommand(args, Command.STOP_SERVICES)) {
      return Command.STOP_SERVICES;
    } else if (matchCommand(args, Command.CLEAN_RESTART_SERVICES)) {
      return Command.CLEAN_RESTART_SERVICES;
    } else if (matchCommand(args, Command.CLEAN)) {
      return Command.CLEAN;
    } else if (matchCommand(args, Command.DEPENDENCY_CHECK)) {
      return Command.DEPENDENCY_CHECK;
    } else if (matchCommand(args, Command.NPM_REGISTRY)) {
      return Command.NPM_REGISTRY;
    } else if (matchCommand(args, Command.HELP)) {
      return Command.HELP;
    } else {
      return Promise.reject(new Error('Invalid command, try $ ./abc-cli help'));
    }
  }
}

function matchCommand(args: string[], command: Command): boolean {
  return args.length > 2 && args[2] === command;
}
