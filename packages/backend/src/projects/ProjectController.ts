import * as express from 'express';
import { Router } from 'express';
import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import { AbcProject } from '@abc-map/shared-entities';
import { asyncHandler } from '../server/asyncHandler';
import { Status } from '../server/Status';

// TODO: partition resources per user
// TODO: ensure users are not anonymous
export class ProjectController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/project';
  }

  public getRouter(): Router {
    const app = express();
    app.post('/', asyncHandler(this.save));
    app.get('/list', asyncHandler(this.list));
    app.get('/:projectId', asyncHandler(this.getById));
    return app;
  }

  public save = (req: express.Request): Promise<Status> => {
    const project: AbcProject = req.body;
    if (!project) {
      return Promise.reject(new Error('Project is mandatory'));
    }

    return this.services.project.save(project).then(() => ({ status: 'saved' }));
  };

  // TODO: FIXME: featch and return only metadata
  public list = (): Promise<AbcProject[]> => {
    return this.services.project.list(0, 50);
  };

  public getById = (req: express.Request): Promise<AbcProject | undefined> => {
    const id = req.params.projectId;
    if (!id) {
      return Promise.reject(new Error('Project id is mandatory'));
    }
    return this.services.project.findById(id);
  };
}
