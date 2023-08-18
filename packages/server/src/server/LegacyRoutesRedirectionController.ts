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

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Language, LegacyRouteRedirections, Logger, WebappRoutes } from '@abc-map/shared';
import { Controller } from './Controller';

export const logger = Logger.get('LegacyRoutesRedirectionController.ts');

// See useRedirectLegacyRoutes.ts too

export class LegacyRoutesRedirectionController extends Controller {
  private routes = new WebappRoutes(Language.English);

  public getRoot(): string {
    return '/';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    LegacyRouteRedirections.ToDocumentation.forEach((regexp) => {
      app.get(regexp, (req: FastifyRequest, reply: FastifyReply) => {
        void reply.redirect(this.routes.staticDocumentation().format());
      });
    });

    LegacyRouteRedirections.ToLanding.forEach((regexp) => {
      app.get(regexp, (req: FastifyRequest, reply: FastifyReply) => {
        void reply.redirect(this.routes.landing().format());
      });
    });
  };
}
