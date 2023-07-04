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

import { Logger } from '@abc-map/shared';
import { Config } from '../config/Config';
import { Services } from '../services/services';
import * as path from 'path';
import { fastify, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifySensible from '@fastify/sensible';
import { Controller } from './Controller';
import { jwtPlugin } from './jwtPlugin';
import fastifyRateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import fastifyView from '@fastify/view';
import { getLang } from './getLang';
import { error409Parameters } from './pagesParameters';
import { HookHandlerDoneFunction } from 'fastify/types/hooks';
import { FastifyError } from '@fastify/error';
import { privateApiControllers, publicApiControllers } from './controllers';
import metricsPlugin from 'fastify-metrics';
import { defaultRateLimitConfig } from './defaultRateLimitConfig';
import { hashRequestSource } from './hashRequestSource';
import { RootController } from './RootController';

const logger = Logger.get('HttpServer.ts', 'trace');

/**
 * API and frontend server.
 *
 * Here responses are not compressed, this should be handled in reverse proxy (Envoy for public official instance)
 *
 */
export class HttpServer {
  public static create(config: Config, services: Services): HttpServer {
    return new HttpServer(config, services, publicApiControllers(config, services), privateApiControllers(config, services), new RootController(config));
  }

  private app: FastifyInstance;

  constructor(
    private config: Config,
    private services: Services,
    private publicControllers: Controller[],
    private privateControllers: Controller[],
    private rootController: RootController
  ) {
    // This server is designed to be used behind a TLS proxy
    this.app = fastify({ trustProxy: true });
  }

  /**
   * Start HTTP server.
   *
   * Returned promise resolve when server is closed.
   */
  public async listen(): Promise<void> {
    const { host, port } = this.config.server;

    return new Promise((resolve, reject) => {
      this.app.addHook('onClose', () => resolve());

      this.app
        .listen({ port, host })
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
    if (this.config.server.log.requests) {
      this.app.addHook('onRequest', this.logRequest);
    }

    // Global error handler
    this.app.setErrorHandler(this.handleError);

    // Rate limit
    void this.app.register(fastifyRateLimit, {
      global: true,
      ...defaultRateLimitConfig(this.config),
    });

    // Utility methods
    void this.app.register(fastifySensible);

    // Metrics
    void this.app.register(metricsPlugin, { defaultMetrics: { enabled: false }, clearRegisterOnInit: true });

    // Templating engine
    void this.app.register(fastifyView, {
      engine: { handlebars: require('handlebars') },
      root: path.resolve(__dirname, '../../public'),
      viewExt: 'html',
    });

    // Add security headers
    // We allow iframes for shared maps
    void this.app.register(helmet, { contentSecurityPolicy: false, frameguard: false });

    // Root controller with frontend and special routes
    void this.app.register(this.rootController.setup);

    // Public API controllers
    void this.app.register(
      async (app) => {
        this.publicControllers.forEach((ctr) => app.register(ctr.setup, { prefix: ctr.getRoot() }));
      },
      { prefix: '/api' }
    );

    // Private controllers, authentication needed
    void this.app.register(
      async (app) => {
        this.authenticationHook(app);
        this.privateControllers.forEach((ctr) => app.register(ctr.setup, { prefix: ctr.getRoot() }));
      },
      { prefix: '/api' }
    );
  }

  private handleError = (err: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const { metrics } = this.services;

    // Log if needed
    if (this.config.server.log.errors) {
      const logTrace = {
        date: new Date().toISOString(),
        error: err.message,
        source: hashRequestSource(request, !this.config.server.log.warnings),
        userAgent: request.headers['user-agent'],
        method: request.method,
        url: request.url,
        status: reply.statusCode,
        stack: err.stack,
      };

      logger.log(JSON.stringify(logTrace));
    }

    // Return 429 error page if necessary
    if (reply.statusCode === 429) {
      void reply.view('error429', error409Parameters(getLang(request)));
      metrics.requestQuotaExceeded();
      return;
    }
    // Or return error and error status
    else {
      void reply.status(reply.statusCode || 500).send(err);
    }
  };

  private logRequest = (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    if (!isItWorthLogging(request)) {
      done();
      return;
    }

    const logTrace = {
      date: new Date().toISOString(),
      source: hashRequestSource(request, !this.config.server.log.warnings),
      userAgent: request.headers['user-agent'],
      method: request.method,
      url: request.url,
      status: reply.statusCode,
    };

    logger.log(JSON.stringify(logTrace));
    done();
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

export function isItWorthLogging(req: FastifyRequest): boolean {
  const userAgent: string | undefined = req.headers['user-agent'];
  const url: string | undefined = req.url;
  if (!userAgent || !url) {
    return true;
  }

  const blacklist: { userAgent: string; route: string }[] = [
    { userAgent: 'kube-probe/', route: '/api/health' },
    { userAgent: 'Prometheus/', route: '/api/metrics' },
    { userAgent: 'Go-http-client/', route: '/' },
  ];

  for (const item of blacklist) {
    if (userAgent.startsWith(item.userAgent) && url === item.route) {
      return false;
    }
  }

  return true;
}
