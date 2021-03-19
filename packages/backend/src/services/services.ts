import { ProjectService } from '../projects/ProjectService';
import { Config } from '../config/Config';
import { MongodbClient } from '../mongodb/MongodbClient';
import { Logger } from '../utils/Logger';
import { UserService } from '../users/UserService';
import { AuthenticationService } from '../authentication/AuthenticationService';
import { HealthCheckService } from '../server/HealthCheckService';
import { AbstractService } from './AbstractService';
import { DataStoreService } from '../datastore/DataStoreService';
import { AuthorizationService } from '../authorization/AuthorizationService';

const logger = Logger.get('services.ts');

export declare type ShutdownFunc = () => void;

export interface Services {
  [k: string]: AbstractService | ShutdownFunc;
  project: ProjectService;
  user: UserService;
  authentication: AuthenticationService;
  health: HealthCheckService;
  datastore: DataStoreService;
  authorization: AuthorizationService;
  shutdown: ShutdownFunc;
}

export async function servicesFactory(config: Config): Promise<Services> {
  const mongodb = await MongodbClient.createAndConnect(config);
  const project = ProjectService.create(config, mongodb);
  const user = UserService.create(config, mongodb);
  const authentication = AuthenticationService.create(config, user);
  const health = HealthCheckService.create(mongodb);
  const datastore = DataStoreService.create(config, mongodb);
  const authorization = AuthorizationService.create(mongodb);

  const shutdown: ShutdownFunc = () => mongodb.disconnect().catch((err) => logger.error(err));

  const services: Services = {
    project,
    user,
    authentication,
    health,
    datastore,
    authorization,
    shutdown,
  };

  for (const name in services) {
    const svc: AbstractService | ShutdownFunc = services[name];
    if (svc instanceof AbstractService) {
      await svc.init();
    }
  }

  return services;
}
