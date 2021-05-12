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

import * as express from 'express';
import { Application, Express, NextFunction, Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import { Logger } from '../utils/Logger';
import { HttpHandlers } from './HttpHandlers';
import { Config } from '../config/Config';
import { Services } from '../services/services';
import * as compression from 'compression';
import * as path from 'path';
import { promises as fs } from 'fs';

const logger = Logger.get('HttpServer.ts', 'info');

export class HttpServer {
  public static create(config: Config, services: Services): HttpServer {
    const handlers = HttpHandlers.create(config, services);
    return new HttpServer(config, services, handlers);
  }

  private indexCache?: Buffer;
  private app: Express;

  constructor(private config: Config, private services: Services, private httpHandlers: HttpHandlers) {
    this.app = express();
    this.app.use(compression());
    this.app.use(bodyParser.json({ limit: '20mb' }));
    this.app.disable('x-powered-by');

    // API service
    const apiRouter = this.httpHandlers.getRouter();
    this.app.use('/api', apiRouter);
    this.app.use('/api', (req, res) => res.status(404).json({ status: 'not found' }));

    // Frontend service
    this.app.use(express.static(this.config.frontendPath));
    this.app.get('/*', this.sendIndex);
  }

  /**
   * Start HTTP server.
   *
   * Returned promise resolve when server is closed.
   */
  public async listen(): Promise<void> {
    await this.loadIndex();

    const port = this.config.server.port;
    const host = this.config.server.host;
    this.app.listen(port, host, () => {
      logger.info(`Abc-Map server listening on http://${host}:${port}`);
    });

    return new Promise((resolve, reject) => {
      this.app.on('error', reject);
      this.app.on('close', () => resolve());
    });
  }

  public getApp(): Application {
    return this.app;
  }

  private async loadIndex(): Promise<void> {
    const indexPath = path.resolve(this.config.frontendPath, 'index.html');
    this.indexCache = await fs.readFile(indexPath);
  }

  private sendIndex = (req: Request, res: Response, next: NextFunction): void => {
    if (!this.indexCache) {
      next(new Error('index.html is not ready'));
      return;
    }

    res.set('Content-Type', 'text/html; charset=UTF-8');
    res.send(this.indexCache);
  };
}
