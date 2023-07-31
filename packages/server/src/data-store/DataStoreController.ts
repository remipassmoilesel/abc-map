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
import { AbcArtefact, artefactFilterFromString, langFromString, PaginatedResponse } from '@abc-map/shared';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyStatic from '@fastify/static';
import { ByIdParams, GetByIdSchema, ListQuery, ListSchema, SearchQuery, SearchSchema } from './DataStoreController.schemas';
import { PaginationHelper } from '../server/helpers/PaginationHelper';

export class DataStoreController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/api/datastore';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    const { datastore } = this.services;

    app.get('/list', { schema: ListSchema }, this.list);
    app.get('/search', { schema: SearchSchema }, this.search);
    app.get('/:artefactId', { schema: GetByIdSchema }, this.getById);

    const root = datastore.getRoot();
    void app.register(fastifyStatic, { root, prefix: '/download', wildcard: true, index: false });
  };

  private list = async (req: FastifyRequest<{ Querystring: ListQuery }>, reply: FastifyReply): Promise<void> => {
    const { datastore, metrics } = this.services;

    const { limit, offset } = PaginationHelper.fromQuery(req);
    const filter = artefactFilterFromString(req.query.filter);
    if (!filter) {
      reply.badRequest('Invalid "filter" parameter');
      return;
    }

    const [content, total] = await Promise.all([datastore.list(limit, offset, filter), datastore.countArtefacts(filter)]);
    const result: PaginatedResponse<AbcArtefact> = {
      content,
      limit,
      offset,
      total,
    };
    void reply.status(200).send(result);

    metrics.datastoreList();
  };

  private search = async (req: FastifyRequest<{ Querystring: SearchQuery }>, reply: FastifyReply): Promise<void> => {
    const { datastore, metrics } = this.services;

    const { limit, offset } = PaginationHelper.fromQuery(req);
    const query = decodeURI(req.query.query);

    const lang = langFromString(req.query.lang);
    if (!lang) {
      reply.badRequest('Invalid "lang" parameter');
      return;
    }

    const filter = artefactFilterFromString(req.query.filter);
    if (!filter) {
      reply.badRequest('Invalid "filter" parameter');
      return;
    }

    const [content, total] = await Promise.all([datastore.search(query, lang, limit, offset, filter), datastore.countArtefacts(filter)]);
    const result: PaginatedResponse<AbcArtefact> = {
      content,
      limit,
      offset,
      total,
    };
    void reply.status(200).send(result);

    metrics.datastoreSearch();
  };

  private getById = async (req: FastifyRequest<{ Params: ByIdParams }>, reply: FastifyReply): Promise<void> => {
    const { datastore } = this.services;

    const id = req.params.artefactId;
    const result = await datastore.findById(id);
    if (result) {
      void reply.status(200).send(result);
    } else {
      reply.notFound();
    }
  };
}
