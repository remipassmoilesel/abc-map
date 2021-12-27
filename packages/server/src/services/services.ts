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

import { ProjectService } from '../projects/ProjectService';
import { Config } from '../config/Config';
import { MongodbClient } from '../mongodb/MongodbClient';
import { Logger } from '@abc-map/shared';
import { UserService } from '../users/UserService';
import { AuthenticationService } from '../authentication/AuthenticationService';
import { HealthCheckService } from '../health/HealthCheckService';
import { AbstractService } from './AbstractService';
import { DataStoreService } from '../data-store/DataStoreService';
import { AuthorizationService } from '../authorization/AuthorizationService';
import { FeedbackService } from '../feedback/FeedbackService';
import { MetricsService } from '../metrics/MetricsService';
import { EmailService } from '../email/EmailService';
import { ProjectionService } from '../projections/ProjectionService';

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
  feedback: FeedbackService;
  metrics: MetricsService;
  emails: EmailService;
  projections: ProjectionService;
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

  const shutdown: ShutdownFunc = () => mongodb.disconnect().catch((err) => logger.error(err));

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
