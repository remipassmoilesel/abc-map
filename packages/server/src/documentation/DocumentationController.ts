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

import { FastifyInstance } from 'fastify';
import { Logger } from '@abc-map/shared';
import * as fastifyStatic from '@fastify/static';
import { Controller } from '../server/Controller';
import { Config } from '../config/Config';

export const logger = Logger.get('DocumentationController.ts');

export class DocumentationController extends Controller {
  constructor(private config: Config) {
    super();
  }

  public getRoot(): string {
    return '/';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    const { userDocumentationPath } = this.config;

    // FIXME: we should return a specific 404 page here
    void app.register((childContext, _, done) => {
      void childContext.register(fastifyStatic, {
        root: userDocumentationPath,
        wildcard: false,
        etag: true,
        maxAge: '3d',
        // If a user enters a URL without a trailing slash, it will be appended. Example: /document/fr/blog -> /document/fr/blog/
        redirect: true,
        prefix: '/documentation/',
      });

      done();
    });
  };
}
