/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

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
import { DataStoreController } from '../data-store/DataStoreController';
import { VoteController } from '../votes/VoteController';

const logger = Logger.get('HttpHandlers.ts', 'info');

export class HttpHandlers {
  public static create(config: Config, services: Services): HttpHandlers {
    const publicControllers = [new HealthCheckController(services), new AuthenticationController(services)];
    const privateControllers = [new ProjectController(services), new UserController(services), new DataStoreController(services), new VoteController(services)];
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
