import * as express from 'express';
import { Router } from 'express';
import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import { HealthStatus } from './HealthCheckService';
import { Logger } from '../utils/Logger';

const logger = Logger.get('HealthCheckController.ts');

export class HealthCheckController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/health';
  }

  public getRouter(): Router {
    const app = express();
    app.get('/', this.healthCheck);
    return app;
  }

  public healthCheck = (req: express.Request, res: express.Response): void => {
    this.services.health
      .getHealthStatus()
      .then((status) => {
        const code = status === HealthStatus.HEALTHY ? 200 : 500;
        res.status(code).json({ status });
      })
      .catch((err) => {
        logger.error('Health check error', err);
        res.status(500).json({ status: HealthStatus.UNHEALTHY });
      });
  };
}
