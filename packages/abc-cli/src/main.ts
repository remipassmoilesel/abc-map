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
  if (process.env.CI === 'true') {
    process.env.YARN_CACHE_FOLDER = `${config.getProjectRoot()}/.yarn-cache`;
    process.env.CYPRESS_CACHE_FOLDER = `${config.getProjectRoot()}/.cypress-cache`;
  }

  banners.cli();
  const command = await parser.parse(args);

  if (Command.BOOSTRAP === command) {
    service.bootstrap();
  } else if (Command.LINT === command) {
    service.lint();
  } else if (Command.BUILD === command) {
    service.cleanBuild();
  } else if (Command.TEST === command) {
    service.test();
  } else if (Command.E2E === command) {
    await service.e2e();
  } else if (Command.WATCH === command) {
    service.watch();
  } else if (Command.CI === command) {
    await service.continuousIntegration();
  } else if (Command.START === command) {
    service.start();
  } else if (Command.START_SERVICES === command) {
    service.startServices();
  } else if (Command.STOP_SERVICES === command) {
    service.stopServices();
  } else if (Command.CLEAN_RESTART_SERVICES === command) {
    service.cleanRestartServices();
  } else if (Command.CLEAN === command) {
    service.clean();
  } else if (Command.DEPENDENCY_CHECK === command) {
    service.dependencyCheck();
  } else if (Command.HELP === command) {
    banners.big();
    service.help();
  }

  banners.done();
}
