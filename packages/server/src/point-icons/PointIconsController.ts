/**
 * Copyright © 2023 Rémi Pace.
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
import { Logger, GetPointIconsRequest, GetPointIconsResponse } from '@abc-map/shared';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { GetIcons } from './PointIcons.schemas';

const logger = Logger.get('PointIconsController.ts');

export class PointIconsController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/api/point-icons';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    app.post('/', { schema: GetIcons }, this.getPointIcons);
  };

  private getPointIcons = async (req: FastifyRequest<{ Body: GetPointIconsRequest }>, reply: FastifyReply): Promise<void> => {
    const { pointIcons } = this.services;

    const response: GetPointIconsResponse = { icons: await pointIcons.getIcons(req.body?.names) };
    void reply.status(200).send(response);
  };
}
