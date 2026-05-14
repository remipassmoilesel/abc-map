/*
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
 *
 *
 */

import { Controller } from '../server/Controller.js';
import { Logger } from '@abc-map/shared';
import type { Services } from '../services/services.js';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Config } from '../config/Config.js';

const logger = Logger.get('MetricsController.ts', 'info');

export class MetricsController extends Controller {
  constructor(
    private config: Config,
    private services: Services,
  ) {
    super();
  }

  public getRoot(): string {
    return '/api/metrics';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    app.get('/', this.getMetrics);

    const url = new URL(this.getRoot(), this.config.externalUrl).toString();
    logger.info(`Prometheus metrics will be served on ${url}`);
  };

  private getMetrics = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const metrics = await this.services.metrics.getMetrics();
    void reply.status(200).send(metrics);
  };
}
