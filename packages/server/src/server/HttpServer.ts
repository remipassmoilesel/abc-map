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

import { Logger } from '../utils/Logger';
import { Config } from '../config/Config';
import { Services } from '../services/services';
import * as path from 'path';
import { promises as fs } from 'fs';
import { FastifyInstance, fastify, FastifyRequest, FastifyReply } from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifySensible from 'fastify-sensible';
import { MetricsController } from '../metrics/MetricsController';
import { HealthCheckController } from '../health/HealthCheckController';
import { AuthenticationController } from '../authentication/AuthenticationController';
import { ProjectController } from '../projects/ProjectController';
import { UserController } from '../users/UserController';
import { DataStoreController } from '../data-store/DataStoreController';
import { VoteController } from '../votes/VoteController';
import { Controller } from './Controller';
import { jwtPlugin } from './jwtPlugin';
import fastifyRateLimit from 'fastify-rate-limit';
import * as helmet from 'helmet';

const logger = Logger.get('HttpServer.ts', 'info');

/**
 * Routes exposed in this controllers are public and do not need a valid authentication
 * @param config
 * @param services
 */
function publicControllers(config: Config, services: Services): Controller[] {
  return [new MetricsController(services), new HealthCheckController(services), new AuthenticationController(config, services)];
}

/**
 * Routes exposed in this controllers are private and need a valid authentication
 * @param config
 * @param services
 */
function privateControllers(config: Config, services: Services): Controller[] {
  return [new ProjectController(services), new UserController(services), new DataStoreController(services), new VoteController(services)];
}

/**
 * API and frontend server.
 *
 * Here responses are not compressed, this should be handled in reverse proxy (Envoy for public official instance)
 *
 */
export class HttpServer {
  public static create(config: Config, services: Services): HttpServer {
    return new HttpServer(config, services, publicControllers(config, services), privateControllers(config, services));
  }

  private indexCache?: Buffer;
  private error429cache?: Buffer;
  private app: FastifyInstance;

  constructor(private config: Config, private services: Services, private publicControllers: Controller[], private privateControllers: Controller[]) {
    this.app = fastify({
      logger: this.config.server.log.requests,
      trustProxy: true,
    });
  }

  /**
   * Start HTTP server.
   *
   * Returned promise resolve when server is closed.
   */
  public async listen(): Promise<void> {
    const port = this.config.server.port;
    const host = this.config.server.host;

    return new Promise((resolve, reject) => {
      this.app.addHook('onClose', () => resolve());

      this.app
        .listen(port, host)
        .then(() => logger.info(`Abc-Map server listening on http://${host}:${port}`))
        .catch((err) => reject(err));
    });
  }

  public getApp(): FastifyInstance {
    return this.app;
  }

  public shutdown() {
    return this.app.close();
  }

  public async initialize(): Promise<void> {
    const { metrics } = this.services;

    // Add security headers
    const middleware = helmet({
      contentSecurityPolicy: false,
    });
    this.app.addHook('onRequest', function (req, reply, next) {
      middleware(req.raw, reply.raw, next as (err?: unknown) => void);
    });

    // Utility methods
    this.app.register(fastifySensible, { errorHandler: false });

    // Global error handler
    this.app.setErrorHandler(async (err, request, reply) => {
      this.config.server.log.errors && logger.error('Unhandled error: ', err);

      // Return 429 error page if necessary
      if (reply.statusCode === 429) {
        reply.header('Content-Type', 'text/html; charset=UTF-8').send(this.error429cache);
        metrics.requestQuotaExceeded();
        return;
      } else {
        reply.status(reply.statusCode || 500).send(err);
      }
    });

    // Rate limit
    this.app.register(fastifyRateLimit, {
      max: this.config.server.rateLimit.max,
      timeWindow: this.config.server.rateLimit.timeWindow,
    });

    // Public API controllers
    this.app.register(
      async (app) => {
        this.publicControllers.forEach((ctr) => app.register(ctr.setup, { prefix: ctr.getRoot() }));
      },
      { prefix: '/api' }
    );

    // Private controllers, authentication needed
    this.app.register(
      async (app) => {
        this.authenticationHook(app);
        this.privateControllers.forEach((ctr) => app.register(ctr.setup, { prefix: ctr.getRoot() }));
      },
      { prefix: '/api' }
    );

    // Frontend service
    // index.html is server from fastify-static when route is '/' or from memory cache otherwise
    this.app.register(fastifyStatic, { wildcard: false, root: this.config.frontendPath });
    this.app.get('/*', this.sendIndex);
    this.app.head('/', async (req: FastifyRequest, res: FastifyReply) => {
      res.status(200).send();
    });

    await this.loadCache();
  }

  private async loadCache(): Promise<void> {
    const indexPath = path.resolve(this.config.frontendPath, 'index.html');
    this.indexCache = await fs.readFile(indexPath);

    const error429Path = path.resolve(this.config.frontendPath, 'error429.html');
    this.error429cache = await fs.readFile(error429Path);
  }

  private sendIndex = (req: FastifyRequest, reply: FastifyReply): void => {
    if (!this.indexCache) {
      throw new Error('index.html is not ready');
    }

    reply.header('Content-Type', 'text/html; charset=UTF-8').status(200).send(this.indexCache);
  };

  private authenticationHook(app: FastifyInstance) {
    jwtPlugin(this.config, app);
    app.addHook('onRequest', async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.forbidden();
      }
    });
  }
}
