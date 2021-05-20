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
import { AbcArtefact, PaginatedResponse } from '@abc-map/shared';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyStatic from 'fastify-static';
import { ByIdParams, GetByIdSchema, ListSchema, SearchQuery, SearchSchema } from './DataStoreController.schemas';
import { PaginatedQuery, PaginationHelper } from '../server/PaginationHelper';

export class DataStoreController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/datastore';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    app.get('/list', { schema: ListSchema }, this.list);
    app.get('/search', { schema: SearchSchema }, this.search);
    app.get('/:artefactId', { schema: GetByIdSchema }, this.getById);

    const root = this.services.datastore.getRoot();
    app.register(fastifyStatic, { root, prefix: '/download' });
  };

  private list = async (req: FastifyRequest<{ Querystring: PaginatedQuery }>, reply: FastifyReply): Promise<void> => {
    const { limit, offset } = PaginationHelper.fromQuery(req);

    const content = await this.services.datastore.list(limit, offset);
    const total = await this.services.datastore.countArtefacts();
    const result: PaginatedResponse<AbcArtefact> = {
      content,
      limit,
      offset,
      total,
    };
    reply.status(200).send(result);
  };

  private search = async (req: FastifyRequest<{ Querystring: SearchQuery }>, reply: FastifyReply): Promise<void> => {
    const { limit, offset } = PaginationHelper.fromQuery(req);
    const query = req.query.query;

    const content = await this.services.datastore.search(query, limit, offset);
    const total = await this.services.datastore.countArtefacts();
    const result: PaginatedResponse<AbcArtefact> = {
      content,
      limit,
      offset,
      total,
    };
    reply.status(200).send(result);
  };

  private getById = async (req: FastifyRequest<{ Params: ByIdParams }>, reply: FastifyReply): Promise<void> => {
    const id = req.params.artefactId;
    const result = await this.services.datastore.findById(id);
    if (result) {
      reply.status(200).send(result);
    } else {
      reply.notFound();
    }
  };
}
