/**
 * Copyright © 2026 Rémi Pace.
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

import { Language, Logger } from '@abc-map/shared';
import type { Config } from '../config/Config.js';
import type { Services } from '../services/services.js';
import path from 'path';
import type { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { fastify } from 'fastify';
import fastifySensible from '@fastify/sensible';
import type { Controller } from './Controller.js';
import { jwtPlugin } from './helpers/jwtPlugin.js';
import fastifyRateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import fastifyView from '@fastify/view';
import { getLang } from './helpers/getLang.js';
import type { FastifyError } from '@fastify/error';
import { privateControllers, publicControllers } from './controllers.js';
import metricsPlugin from 'fastify-metrics';
import { defaultRateLimitConfig } from './helpers/defaultRateLimitConfig.js';
import { hashRequestSource } from './helpers/hashRequestSource.js';
import { isItWorthLogging } from './helpers/isItWorthLogging.js';
import handlebars from 'handlebars';

const logger = Logger.get('HttpServer.ts', 'info');

/**
 * API and webapp server.
 *
 * Here responses are not compressed, this should be handled in reverse proxy (Envoy per example)
 *
 */
export class HttpServer {
  public static create(config: Config, services: Services): HttpServer {
    const controllers = {
      public: publicControllers(config, services),
      private: privateControllers(config, services),
    };
    return new HttpServer(config, services, controllers);
  }

  private app: FastifyInstance;

  private debugRoutes = false;
  private routes: string[] = [];

  constructor(
    private config: Config,
    private services: Services,
    private controllers: { public: Controller[]; private: Controller[] },
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
    if (this.debugRoutes) {
      this.app.addHook('onRoute', (routeOptions) => {
        this.routes.push(
          JSON.stringify({
            method: routeOptions.method,
            url: routeOptions.url,
            prefix: routeOptions.prefix,
          }),
        );
      });
    }

    if (this.config.server.log.requests) {
      this.app.addHook('onRequest', this.logRequest);
    }

    // Global error handler
    this.app.setErrorHandler(this.handleError);

    // Rate limit
    await this.app.register(fastifyRateLimit, {
      global: true,
      ...defaultRateLimitConfig(this.config),
    });

    // Utility methods
    await this.app.register(fastifySensible);

    // Metrics
    await this.app.register(metricsPlugin.default, {
      // Default metrics are already registered by MetricsService
      defaultMetrics: { enabled: false },
      clearRegisterOnInit: false,
      promClient: this.services.metrics.getClient(),
      // We disable plugin metrics exposure, we use our own, see MetricsController
      endpoint: null,
    });

    // Templating engine
    await this.app.register(fastifyView, {
      engine: { handlebars: handlebars },
      root: path.resolve(import.meta.dirname, '../../public'),
      viewExt: 'html',
    });

    // Add security headers
    // We allow iframes for shared maps
    await this.app.register(helmet, { contentSecurityPolicy: false, frameguard: false, referrerPolicy: { policy: 'origin' } });

    // Public controllers
    await this.app.register(async (app) => {
      this.controllers.public.forEach((ctr) => app.register(ctr.setup, { prefix: ctr.getRoot() }));
    });

    // Private controllers, authentication needed
    await this.app.register(async (app) => {
      this.authenticationHook(app);
      this.controllers.private.forEach((ctr) => app.register(ctr.setup, { prefix: ctr.getRoot() }));
    });

    if (this.debugRoutes) {
      logger.info('Registered routes: ');
      this.routes.forEach((route) => logger.info(route));
    }
  }

  private handleError = (err: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const { metrics } = this.services;

    // Log if needed
    if (this.config.server.log.errors) {
      const logTrace = {
        date: new Date().toISOString(),
        error: err.message,
        source: hashRequestSource(request, this.config.server.log.warnings),
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
      void reply.view('webapp/error429', error409Parameters(getLang(request)));
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
      source: hashRequestSource(request, this.config.server.log.warnings),
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
      } catch {
        await reply.forbidden();
      }
    });
  }
}

interface Error409Parameters {
  lang: string;
  title: string;
  message: string;
}

export function error409Parameters(lang: Language): Error409Parameters {
  switch (lang) {
    case Language.French:
      return {
        lang,
        title: 'Quota de demandes dépassé 😭',
        message: 'Nous avons reçu trop de demandes en provenance de votre adresse IP, veuillez réessayer plus tard.',
      };
    case Language.English:
      return {
        lang,
        title: 'Quota of requests exceeded 😭',
        message: 'We have received too many requests from your IP address, please try again later.',
      };
  }
}
