import * as express from 'express';
import { Express } from 'express';
import * as bodyParser from 'body-parser';
import { Logger } from '../utils/Logger';
import { HttpHandlers } from './HttpHandlers';
import { Config } from '../config/Config';
import { Controller } from './Controller';
import { Services } from '../services/services';

const logger = Logger.get('HttpServer.ts', 'info');

export class HttpServer {
  public static create(config: Config, publicControllers: Controller[], privateControllers: Controller[], services: Services): HttpServer {
    const handlers = new HttpHandlers(config, services, publicControllers, privateControllers);
    return new HttpServer(config, handlers, services);
  }

  private app: Express;

  constructor(private config: Config, private httpHandlers: HttpHandlers, private services: Services) {
    this.app = express();

    this.setupHttpServer();
    const router = this.httpHandlers.getRouter();

    this.app.use('/api', router);
  }

  /**
   * Start server.
   *
   * Returned promise resolve when server is closed.
   */
  public listen(): Promise<void> {
    const port = this.config.server.port;
    const host = this.config.server.host;
    this.app.listen(port, host, () => {
      logger.info(`Abc-Map backend server listening on http://${host}:${port}`);
    });

    return new Promise((resolve, reject) => {
      this.app.on('error', reject);
      this.app.on('close', () => resolve());
    });
  }

  private setupHttpServer(): void {
    this.app.use(bodyParser.json({ limit: '20mb' }));
    this.app.disable('x-powered-by');
  }
}
