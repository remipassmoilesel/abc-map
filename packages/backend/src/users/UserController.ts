import * as express from 'express';
import { Router } from 'express';
import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import { asyncHandler } from '../server/asyncHandler';
import { Status } from '../server/Status';

export class UserController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/user';
  }

  public getRouter(): Router {
    const app = express();
    app.post('/:id', asyncHandler(this.updateUser));
    return app;
  }

  // TODO: implement
  public async updateUser(): Promise<Status> {
    return Promise.reject(new Error('Not implemented'));
  }
}
