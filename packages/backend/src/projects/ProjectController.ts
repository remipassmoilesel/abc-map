import * as express from 'express';
import * as multer from 'multer';
import { Router } from 'express';
import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import { AbcProjectMetadata } from '@abc-map/shared-entities';
import { asyncHandler } from '../server/asyncHandler';
import { Status } from '../server/Status';
import { Authentication } from '../authentication/Authentication';
import { CompressedProject } from './CompressedProject';

const upload = multer({
  // WARNING: memory storage can cause issues in case of high concurrency
  // TODO: check multer-gridfs-storage
  storage: multer.memoryStorage(),
  limits: {
    headerPairs: 2,
    files: 1,
    fileSize: 3e7, // 30 MB
  },
});

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
    app.post('/', upload.single('project'), asyncHandler(this.save));
    app.get('/list', asyncHandler(this.list));
    app.get('/:projectId', asyncHandler(this.findById));
    return app;
  }

  public save = async (req: express.Request, res: express.Response): Promise<void> => {
    const user = Authentication.from(req);
    const metadata: AbcProjectMetadata | any = JSON.parse(req.body.metadata);
    const file = req.file.buffer;
    if (!user?.id || !metadata || !metadata.id || !file) {
      return Promise.reject(new Error('Invalid request'));
    }

    const project: CompressedProject = {
      metadata,
      project: file,
    };

    const result: Status = await this.services.project.save(user.id, project).then(() => ({ status: 'saved' }));
    res.status(200).json(result);
  };

  public list = async (req: express.Request, res: express.Response): Promise<void> => {
    const user = Authentication.from(req);
    if (!user?.id) {
      return Promise.reject(new Error('Invalid request'));
    }

    const result: AbcProjectMetadata[] = await this.services.project.list(user.id, 0, 50);
    res.status(200).json(result);
  };

  public findById = async (req: express.Request, res: express.Response): Promise<void> => {
    const id = req.params.projectId;
    if (!id) {
      return Promise.reject(new Error('Project id is mandatory'));
    }

    const result = await this.services.project.findById(id);
    if (!result) {
      res.status(404).send();
      return;
    }

    res.status(200).contentType('application/zip').send(result.project);
  };
}
