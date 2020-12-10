import 'source-map-support/register';
import { Logger } from './utils/Logger';
import { HttpServer } from './server/HttpServer';
import { ProjectController } from './projects/ProjectController';
import { servicesFactory } from './services';
import { ConfigLoader } from './config/ConfigLoader';

const logger = Logger.get('main.ts', 'info');

async function main() {
  logger.info('Starting Abc-Map ...');
  const config = await ConfigLoader.load();
  const services = await servicesFactory(config);
  const controllers = [new ProjectController(services)];
  const server = HttpServer.create(config, controllers);
  return server.listen().finally(() => services.shutdown());
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
