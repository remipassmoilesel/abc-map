import * as express from 'express';
import { Controller } from './Controller';
import { Logger } from '../utils/Logger';
import { Router } from 'express';

const logger = Logger.get('HttpHandlers.ts', 'info');

export class HttpHandlers {
  constructor(private controllers: Controller[]) {}

  public getRouter(): Router {
    const app = express();

    this.controllers.forEach((ctr) => {
      app.use(ctr.getRoot(), ctr.getRouter());
    });

    return app;
  }
}
