/**
 * Copyright © 2022 Rémi Pace.
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

import { Config } from '../config/Config';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Language, Logger } from '@abc-map/shared';
import { indexParameters } from './pagesParameters';
import { getLang } from './getLang';
import { generateSitemap } from './sitemap';
import * as fastifyStatic from '@fastify/static';
import * as path from 'path';

export const logger = Logger.get('RootController.ts');

export class RootController {
  constructor(private config: Config) {}

  public getRoot(): string {
    return '/';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    const { legalMentions, externalUrl, frontendPath } = this.config;

    // Legal mentions
    app.get('/api/legal-mentions', (req, reply) => void reply.send(legalMentions));

    // Sitemap
    app.get('/sitemap.xml', (req: FastifyRequest, reply: FastifyReply) => {
      const sitemap = generateSitemap(externalUrl, Object.values(Language));
      void reply.status(200).header('Content-Type', 'text/xml; charset=utf-8').send(sitemap);
    });

    // Frontend app
    app.get('/', (req: FastifyRequest, reply: FastifyReply) => {
      void reply.view('index', indexParameters(this.config, getLang(req)));
    });

    app.get('/*', (req: FastifyRequest, reply: FastifyReply) => {
      void reply.view('index', indexParameters(this.config, getLang(req)));
    });

    // We MUST overwrite /index.html route, otherwise it will be served without templating (e.g. to web workers)
    app.get('/index.html', (req: FastifyRequest, reply: FastifyReply) => {
      void reply.view('index', indexParameters(this.config, getLang(req)));
    });

    // Frontend assets
    void app.register(fastifyStatic, {
      root: path.join(frontendPath, '/assets'),
      wildcard: false,
      index: false,
      etag: true,
      maxAge: '3d',
    });
  };
}
