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

import { Config } from '../config/Config';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Language, Logger, WebappRoutes } from '@abc-map/shared';
import { getLang } from './helpers/getLang';
import * as fastifyStatic from '@fastify/static';
import * as path from 'path';
import { Controller } from './Controller';

export const logger = Logger.get('WebappController.ts');

export class WebappController extends Controller {
  private routes = new WebappRoutes(Language.English);

  constructor(private config: Config) {
    super();
  }

  public getRoot(): string {
    return '/';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    const { webappPath } = this.config;

    // Landing
    app.get('/', (req: FastifyRequest, reply: FastifyReply) => {
      void reply.view('webapp/index', indexParameters(this.config, getLang(req)));
    });

    // We MUST overwrite /index.html route, otherwise it will be served without templating (e.g. to web workers)
    app.get('/index.html', (req: FastifyRequest, reply: FastifyReply) => {
      void reply.view('webapp/index', indexParameters(this.config, getLang(req)));
    });

    // We register webapp routes for deep link usage
    this.routes.getMainRoutes().forEach((route) => {
      app.get(route.raw(), (req: FastifyRequest, reply: FastifyReply) => {
        void reply.view('webapp/index', indexParameters(this.config, getLang(req)));
      });
    });

    // Webapp assets
    void app.register(fastifyStatic, {
      root: path.join(webappPath, '/assets'),
      wildcard: false,
      index: false,
      etag: true,
      maxAge: '3d',
      decorateReply: false,
    });

    // In case of module we reply with webapp and status 200. We can not check if module exists because they can be dynamically loaded
    app.get('/:lang/modules/*', (req: FastifyRequest, reply: FastifyReply) => {
      void reply.status(200).view('webapp/index', indexParameters(this.config, getLang(req)));
    });

    // In case nothing match, we reply with webapp and status 404.
    // We must reply with webapp in case nothing match, it may be an old link like https://abc-map.fr/faq
    app.get('/*', (req: FastifyRequest, reply: FastifyReply) => {
      void reply.status(404).view('webapp/index', indexParameters(this.config, getLang(req)));
    });
  };
}

interface IndexParameters {
  lang: string;
  title: string;
  description: string;
  keywords: string;
  noScript: string;
  externalUrl: string;
  appendToBody: string | undefined;
}

export function indexParameters(config: Config, lang: Language): IndexParameters {
  switch (lang) {
    case Language.French:
      return {
        lang,
        title: '🌍 Abc-Map - Cartographie libre et gratuite en ligne',
        description: 'Abc-Map, nouvelle version 🚀 Créez des cartes géographiques simplement: importez, dessinez, visualisez des données, et bien plus !',
        keywords: 'carte, cartographie, géographie, système information géographique, statistique, analyse spatiale, logiciel en ligne',
        noScript: 'Vous devez activer Javascript pour utiliser cette application',
        externalUrl: config.externalUrl,
        appendToBody: config.webapp?.appendToBody,
      };
    case Language.English:
      return {
        lang,
        title: '🌍 Abc-Map - Free (as in freedom) online mapping',
        description: 'Abc-Map, new version 🚀 Easily create geographic maps: import, draw, visualize data, and more!',
        keywords: 'map, cartography, geography, geographic information system, statistics, spatial analysis, online software',
        noScript: 'You must enable JavaScript to use this application',
        externalUrl: config.externalUrl,
        appendToBody: config.webapp?.appendToBody,
      };
  }
}
