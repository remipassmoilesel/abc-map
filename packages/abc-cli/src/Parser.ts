import { Command } from './Command';

export class Parser {
  // TODO: refactor
  public async parse(args: string[]): Promise<Command> {
    if (args.indexOf(Command.BOOSTRAP) !== -1) {
      return Command.BOOSTRAP;
    } else if (args.indexOf(Command.LINT) !== -1) {
      return Command.LINT;
    } else if (args.indexOf(Command.CLEAN_BUILD) !== -1) {
      return Command.CLEAN_BUILD;
    } else if (args.indexOf(Command.TEST) !== -1) {
      return Command.TEST;
    } else if (args.indexOf(Command.E2E) !== -1) {
      return Command.E2E;
    } else if (args.indexOf(Command.WATCH) !== -1) {
      return Command.WATCH;
    } else if (args.indexOf(Command.CI) !== -1) {
      return Command.CI;
    } else if (args.indexOf(Command.START) !== -1) {
      return Command.START;
    } else if (args.indexOf(Command.STOP_SERVICES) !== -1) {
      return Command.STOP_SERVICES;
    } else if (args.indexOf(Command.CLEAN_RESTART_SERVICES) !== -1) {
      return Command.CLEAN_RESTART_SERVICES;
    } else {
      return Promise.reject(new Error('Invalid command'));
    }
  }
}
