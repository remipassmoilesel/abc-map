import * as express from 'express';
import { Express } from 'express';
import * as bodyParser from 'body-parser';
import { Logger } from '../utils/Logger';
import { HttpHandlers } from './HttpHandlers';
import { Config } from '../config/Config';
import { Controller } from './Controller';

const logger = Logger.get('HttpServer.ts', 'info');

export class HttpServer {
  public static create(config: Config, controllers: Controller[]): HttpServer {
    return new HttpServer(config, new HttpHandlers(controllers));
  }

  private app: Express;

  constructor(private config: Config, private httpHandlers: HttpHandlers) {
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
