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

import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import { HealthStatus } from './HealthCheckService';
import { Logger } from '@abc-map/shared';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const logger = Logger.get('HealthCheckController.ts');

export class HealthCheckController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/api/health';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    app.head('/', this.head);
    app.get('/', this.healthCheck);
  };

  private head = async (req: FastifyRequest, reply: FastifyReply) => {
    void reply.status(200).send();
  };

  private healthCheck = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const status = await this.services.health.getHealthStatus();
      const code = status === HealthStatus.HEALTHY ? 200 : 500;
      void reply.status(code).send({ status });
    } catch (err) {
      logger.error('Health check error', err);
      void reply.status(500).send({ status: HealthStatus.UNHEALTHY });
    }
  };
}
