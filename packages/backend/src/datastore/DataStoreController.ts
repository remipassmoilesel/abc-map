import * as express from 'express';
import { Router } from 'express';
import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import { asyncHandler } from '../server/asyncHandler';
import { AbcArtefact } from '@abc-map/shared-entities';

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
    app.use('/download', express.static(this.services.datastore.getDatastorePath()));
    return app;
  }

  public list = (): Promise<AbcArtefact[]> => {
    return this.services.datastore.list(0, 50);
  };

  public search = (req: express.Request): Promise<AbcArtefact[]> => {
    const query: string = req.query.query as string;
    if (!query) {
      return Promise.reject(new Error('Query is mandatory'));
    }
    return this.services.datastore.search(query, 0, 50);
  };

  public getById = (req: express.Request): Promise<AbcArtefact | undefined> => {
    const id = req.params.artefactId;
    if (!id) {
      return Promise.reject(new Error('Artefact id is mandatory'));
    }
    return this.services.datastore.findById(id);
  };
}
