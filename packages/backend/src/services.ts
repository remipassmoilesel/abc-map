import { ProjectService } from './projects/ProjectService';
import { Config } from './config/Config';
import { MongodbClient } from './mongodb/MongodbClient';
import { Logger } from './utils/Logger';

const logger = Logger.get('services.ts');

export declare type ShutdownFunc = () => void;

export interface Services {
  project: ProjectService;
  shutdown: ShutdownFunc;
}

export async function servicesFactory(config: Config): Promise<Services> {
  const mongodbClient = await MongodbClient.createAndConnect(config);
  const project = ProjectService.create(config, mongodbClient);
  const shutdown: ShutdownFunc = () => {
    mongodbClient.disconnect().catch((err) => logger.error(err));
  };
  return {
    project,
    shutdown,
  };
}
