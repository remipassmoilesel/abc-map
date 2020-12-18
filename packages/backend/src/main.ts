import 'source-map-support/register';
import { Logger } from './utils/Logger';
import { HttpServer } from './server/HttpServer';
import { ProjectController } from './projects/ProjectController';
import { servicesFactory } from './services/services';
import { ConfigLoader } from './config/ConfigLoader';
import { UserController } from './users/UserController';
import { AuthenticationController } from './authentication/AuthenticationController';
import { HealthCheckController } from './server/HealthCheckController';

const logger = Logger.get('main.ts', 'info');

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});

async function main() {
  logger.info('Starting Abc-Map ...');
  const config = await ConfigLoader.load();
  const services = await servicesFactory(config);
  const publicControllers = [new HealthCheckController(services), new AuthenticationController(services)];
  const privateControllers = [new ProjectController(services), new UserController(services)];
  const server = HttpServer.create(config, publicControllers, privateControllers, services);
  return server.listen().finally(() => services.shutdown());
}
