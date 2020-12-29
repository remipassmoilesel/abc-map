import 'source-map-support/register';
import { Logger } from './Logger';
import { Config } from './Config';
import { Shell } from './Shell';
import { Parser } from './Parser';
import { Service } from './Service';
import { Command } from './Command';
import { Banners } from './Banners';

const logger = Logger.get('main.ts', 'info');

main(process.argv).catch((err) => {
  logger.error(err);
  process.exit(1);
});

async function main(args: string[]) {
  const banners = new Banners();
  const config = new Config();
  const shell = new Shell(config);
  const parser = new Parser();
  const service = new Service(config, shell);

  process.env.PATH = `${process.env.PATH}:${config.getCliRoot()}/node_modules/.bin/`;

  banners.cli();
  const command = await parser.parse(process.argv);

  if (Command.BOOSTRAP === command) {
    service.bootstrap();
  } else if (Command.LINT === command) {
    service.lint();
  } else if (Command.CLEAN_BUILD === command) {
    service.cleanBuild();
  } else if (Command.TEST === command) {
    service.test();
  } else if (Command.E2E === command) {
    await service.e2e();
  } else if (Command.WATCH === command) {
    service.watch();
  } else if (Command.CI === command) {
    service.bootstrap();
    service.lint();
    service.cleanBuild();
    service.test();
    await service.e2e();
  } else if (Command.START === command) {
    service.start();
  } else if (Command.STOP_SERVICES === command) {
    service.stopServices();
  } else if (Command.CLEAN_RESTART_SERVICES === command) {
    service.cleanRestart();
  } else {
    const message = `Invalid command: ${args.slice(2).join(' ')}\nTry: ${Object.values(Command).join(', ')}`;
    return Promise.reject(new Error(message));
  }

  banners.done();
}
