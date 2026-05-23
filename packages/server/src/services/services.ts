/**
 * Copyright © 2026 Rémi Pace.
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

import { ProjectService } from '../projects/ProjectService.js';
import type { Config } from '../config/Config.js';
import { MongodbClient } from '../mongodb/MongodbClient.js';
import { Logger } from '@abc-map/shared';
import { UserService } from '../users/UserService.js';
import { AuthenticationService } from '../authentication/AuthenticationService.js';
import { HealthCheckService } from '../health/HealthCheckService.js';
import { AbstractService } from './AbstractService.js';
import { DataStoreService } from '../data-store/DataStoreService.js';
import { AuthorizationService } from '../authorization/AuthorizationService.js';
import { FeedbackService } from '../feedback/FeedbackService.js';
import { MetricsService } from '../metrics/MetricsService.js';
import { EmailService } from '../email/EmailService.js';
import { ProjectionService } from '../projections/ProjectionService.js';
import { PointIconsService } from '../point-icons/PointIconsService.js';

const logger = Logger.get('services.ts');

export declare type ShutdownFunc = () => Promise<void>;

export interface Services {
  [k: string]: AbstractService | ShutdownFunc;
  project: ProjectService;
  user: UserService;
  authentication: AuthenticationService;
  health: HealthCheckService;
  datastore: DataStoreService;
  authorization: AuthorizationService;
  feedback: FeedbackService;
  metrics: MetricsService;
  emails: EmailService;
  projections: ProjectionService;
  pointIcons: PointIconsService;
  shutdown: ShutdownFunc;
}

export async function servicesFactory(config: Config): Promise<Services> {
  const mongodb = await MongodbClient.createAndConnect(config);
  const project = ProjectService.create(config, mongodb);
  const user = UserService.create(config, mongodb);
  const emails = EmailService.create(config);
  const authentication = AuthenticationService.create(config, mongodb, user, emails);
  const health = HealthCheckService.create(mongodb);
  const datastore = DataStoreService.create(config, mongodb);
  const authorization = AuthorizationService.create(mongodb);
  const feedback = FeedbackService.create(mongodb);
  const metrics = MetricsService.create();
  const projections = ProjectionService.create(config, mongodb);
  const pointIcons = PointIconsService.create(config);

  const services: Services = {
    project,
    user,
    authentication,
    health,
    datastore,
    authorization,
    feedback,
    metrics,
    emails,
    projections,
    pointIcons,
    shutdown: async () => undefined,
  };

  for (const name in services) {
    const svc: AbstractService | ShutdownFunc = services[name];
    if (svc instanceof AbstractService) {
      await svc.init();
    }
  }

  services.shutdown = async () => {
    for (const name in services) {
      const svc: AbstractService | ShutdownFunc = services[name];
      if (svc instanceof AbstractService) {
        await svc.shutdown().catch((err) => logger.error(err));
      }
    }

    await mongodb.disconnect().catch((err) => logger.error(err));
  };

  return services;
}
