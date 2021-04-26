import 'source-map-support/register';
import { Logger } from './tools/Logger';
import { Config } from './Config';
import { Shell } from './tools/Shell';
import { Parser } from './parser/Parser';
import { Dependencies, Service } from './Service';
import { Command } from './parser/Command';
import { Banners } from './tools/Banners';
import { Registry } from './tools/Registry';

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

  if (Command.INSTALL === command) {
    const production = args.findIndex((a) => a === '--production') !== -1;
    await service.install(production ? Dependencies.Production : Dependencies.Development);
  } else if (Command.LINT === command) {
    service.lint();
  } else if (Command.BUILD === command) {
    service.cleanBuild();
  } else if (Command.TEST === command) {
    service.test();
  } else if (Command.E2E === command) {
    await service.install(Dependencies.Production);
    await service.e2e();
  } else if (Command.WATCH === command) {
    service.watch();
  } else if (Command.CI === command) {
    await service.continuousIntegration();
    banners.done();
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
  } else if (Command.NPM_REGISTRY === command) {
    await service.startRegistry(true);
  } else if (Command.HELP === command) {
    banners.big();
    service.help();
  }
}
