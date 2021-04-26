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
