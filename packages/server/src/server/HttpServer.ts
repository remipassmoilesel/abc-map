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

import { Language, Logger } from '@abc-map/shared';
import { Config } from '../config/Config';
import { Services } from '../services/services';
import * as path from 'path';
import { fastify, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifySensible from 'fastify-sensible';
import { Controller } from './Controller';
import { jwtPlugin } from './jwtPlugin';
import fastifyRateLimit from 'fastify-rate-limit';
import * as helmet from 'helmet';
import { generateSitemap } from './sitemap';
import pointOfView from 'point-of-view';
import { getLang } from './getLang';
import { error409Parameters, indexParameters } from './pagesParameters';
import { HookHandlerDoneFunction } from 'fastify/types/hooks';
import { FastifyError } from 'fastify-error';
import { createHash } from 'crypto';
import { privateControllers, publicControllers } from './controllers';
import * as metricsPlugin from 'fastify-metrics';

const logger = Logger.get('HttpServer.ts', 'trace');

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

  private app: FastifyInstance;

  constructor(private config: Config, private services: Services, private publicControllers: Controller[], private privateControllers: Controller[]) {
    this.app = fastify({ trustProxy: true });
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
    if (this.config.server.log.requests) {
      this.app.addHook('onRequest', this.logRequest);
    }

    // Metrics
    void this.app.register(metricsPlugin, { register: this.services.metrics.getRegistry(), enableDefaultMetrics: false });

    // Templating engine
    void this.app.register(pointOfView, {
      engine: { handlebars: require('handlebars') },
      root: path.resolve(__dirname, '../../public'),
      viewExt: 'html',
    });

    // Add security headers
    // The first middleware is strict, for the classic use of frontend
    const strictMiddleware = helmet({ contentSecurityPolicy: false });
    // The second middleware allows iframes
    const allowIframesMiddleware = helmet({ contentSecurityPolicy: false, frameguard: false });
    this.app.addHook('onRequest', (req, reply, next) => {
      if (req.url.indexOf('/shared-map/') !== -1) {
        allowIframesMiddleware(req.raw, reply.raw, next as (err?: unknown) => void);
      } else {
        strictMiddleware(req.raw, reply.raw, next as (err?: unknown) => void);
      }
    });

    // Utility methods
    void this.app.register(fastifySensible, { errorHandler: false });

    // Global error handler
    this.app.setErrorHandler(this.handleError);

    // Rate limit
    const globalRateLimit = this.config.server.globalRateLimit;
    void this.app.register(fastifyRateLimit, {
      max: globalRateLimit.max,
      timeWindow: globalRateLimit.timeWindow,
    });

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

    // Legal mentions
    this.app.get('/api/legal-mentions', (req, reply) => void reply.send(this.config.legalMentions));

    // Sitemap
    this.app.get('/sitemap.xml', this.generateSitemap);

    // Frontend service
    // We MUST overwrite /index.html route, otherwise it will be served without templating
    this.app.get('/*', (req: FastifyRequest, reply: FastifyReply) => {
      void reply.view('index', indexParameters(this.config, getLang(req)));
    });
    this.app.get('/index.html', (req: FastifyRequest, reply: FastifyReply) => {
      void reply.view('index', indexParameters(this.config, getLang(req)));
    });

    this.app.head('/', (req: FastifyRequest, reply: FastifyReply) => {
      void reply.status(200).send();
    });

    void this.app.register(fastifyStatic, {
      root: path.join(this.config.frontendPath, '/assets'),
      wildcard: false,
      index: false,
      etag: true,
      maxAge: '3d',
    });
  }

  private handleError = (err: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const { metrics } = this.services;

    // Log if needed
    if (this.config.server.log.errors) {
      const logTrace = {
        date: new Date().toISOString(),
        error: err.message,
        source: hashSource(request),
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
      source: hashSource(request),
      userAgent: request.headers['user-agent'],
      method: request.method,
      url: request.url,
      status: reply.statusCode,
    };

    logger.log(JSON.stringify(logTrace));
    done();
  };

  private generateSitemap = (req: FastifyRequest, reply: FastifyReply) => {
    const sitemap = generateSitemap(this.config.externalUrl, Object.values(Language));
    void reply.status(200).header('Content-Type', 'text/xml; charset=utf-8').send(sitemap);
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

export function hashSource(req: FastifyRequest): string {
  const hasher = createHash('sha256');
  const ip = (req.headers['x-forwarded-for']?.toString() || '000.000.000.000').split('.').slice(1).join('.');
  const ua = req.headers['user-agent'] || 'no-user-agent';
  return hasher.update(ip + ua).digest('hex');
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
