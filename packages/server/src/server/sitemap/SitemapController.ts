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

import { Config } from '../../config/Config';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from '@abc-map/shared';
import { Sitemap } from './Sitemap';
import { Controller } from '../Controller';

export const logger = Logger.get('SitemapController.ts');

export class SitemapController extends Controller {
  constructor(private config: Config) {
    super();
  }

  public getRoot(): string {
    return '/';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    const { externalUrl } = this.config;

    const sitemap = await Sitemap.create(externalUrl).build();

    app.get('/sitemap.xml', (req: FastifyRequest, reply: FastifyReply) => {
      void reply.status(200).header('Content-Type', 'text/xml; charset=utf-8').send(sitemap);
    });
  };
}
