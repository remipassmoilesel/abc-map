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

import { Controller } from '../server/Controller.js';
import type { Services } from '../services/services.js';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ByCodeParams } from './ProjectionController.schemas.js';
import { ByCodeSchema } from './ProjectionController.schemas.js';
import '@fastify/sensible';

export class ProjectionController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/api/projections';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    app.get('/:code', { schema: ByCodeSchema }, this.findById);
  };

  private findById = async (req: FastifyRequest<{ Params: ByCodeParams }>, reply: FastifyReply): Promise<void> => {
    const { projections } = this.services;

    const result = await projections.findByCode(req.params.code);
    void reply.status(200).send(result);
  };
}
