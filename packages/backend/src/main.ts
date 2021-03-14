import 'source-map-support/register';
import { Logger } from './utils/Logger';
import { HttpServer } from './server/HttpServer';
import { servicesFactory } from './services/services';
import { ConfigLoader } from './config/ConfigLoader';
import { DevInit } from './dev-init/DevInit';

const logger = Logger.get('main.ts', 'info');

main().catch((err: Error) => {
  logger.error('Server crashed: ', err);
  process.exit(1);
});

async function main() {
  logger.info('Starting Abc-Map ...');
  const config = await ConfigLoader.load();
  const services = await servicesFactory(config);

  if (config.development) {
    logger.warn('/!\\ WARNING, development data will be created');
    await DevInit.create(config, services).init();
  }

  services.datastore.index().catch((err) => logger.error(err));

  const server = HttpServer.create(config, services);
  return server.listen().finally(() => services.shutdown());
}
