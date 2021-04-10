import * as express from 'express';
import { Router } from 'express';
import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import { asyncHandler } from '../server/asyncHandler';
import { AbcArtefact, PaginatedResponse } from '@abc-map/shared-entities';

export class DataStoreController extends Controller {
  constructor(private services: Services) {
    super();
  }

  public getRoot(): string {
    return '/datastore';
  }

  public getRouter(): Router {
    const app = express();
    app.get('/list', asyncHandler(this.list));
    app.get('/search', asyncHandler(this.search));
    app.get('/:artefactId', asyncHandler(this.getById));
    app.use('/download', express.static(this.services.datastore.getRoot()));
    return app;
  }

  public list = async (req: express.Request, res: express.Response): Promise<void> => {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const content = await this.services.datastore.list(limit, offset);
    const total = await this.services.datastore.countArtefacts();
    const result: PaginatedResponse<AbcArtefact> = {
      content,
      limit,
      offset,
      total,
    };
    res.status(200).json(result);
  };

  public search = async (req: express.Request, res: express.Response): Promise<void> => {
    const query: string = req.query.query as string;
    if (!query) {
      return Promise.reject(new Error('Query is mandatory'));
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const content = await this.services.datastore.search(query, limit, offset);
    const total = await this.services.datastore.countArtefacts();
    const result: PaginatedResponse<AbcArtefact> = {
      content,
      limit,
      offset,
      total,
    };
    res.status(200).json(result);
  };

  public getById = async (req: express.Request, res: express.Response): Promise<void> => {
    const id = req.params.artefactId;
    if (!id) {
      return Promise.reject(new Error('Artefact id is mandatory'));
    }

    const result: AbcArtefact | undefined = await this.services.datastore.findById(id);
    res.status(200).json(result);
  };
}
