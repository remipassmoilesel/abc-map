import * as express from 'express';
import { Controller } from './Controller';
import { Logger } from '../utils/Logger';
import { Router } from 'express';
import { Services } from '../services/services';
import { Config } from '../config/Config';
import { HealthCheckController } from './HealthCheckController';
import { AuthenticationController } from '../authentication/AuthenticationController';
import { ProjectController } from '../projects/ProjectController';
import { UserController } from '../users/UserController';
import { DataStoreController } from '../datastore/DataStoreController';

const logger = Logger.get('HttpHandlers.ts', 'info');

export class HttpHandlers {
  public static create(config: Config, services: Services): HttpHandlers {
    const publicControllers = [new HealthCheckController(services), new AuthenticationController(services)];
    const privateControllers = [new ProjectController(services), new UserController(services), new DataStoreController(services)];
    return new HttpHandlers(config, services, publicControllers, privateControllers);
  }

  constructor(private config: Config, private services: Services, private publicControllers: Controller[], private privateControllers: Controller[]) {}

  public getRouter(): Router {
    const app = express();
    this.services.authentication.initAuthentication(app);

    this.publicControllers.forEach((ctr) => {
      app.use(ctr.getRoot(), ctr.getRouter());
    });

    this.services.authentication.authenticationMiddleware(app);

    this.privateControllers.forEach((ctr) => {
      app.use(ctr.getRoot(), ctr.getRouter());
    });

    return app;
  }
}
