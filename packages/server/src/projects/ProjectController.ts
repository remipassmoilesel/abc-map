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
import * as multer from 'multer';
import { Router } from 'express';
import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import { AbcProjectMetadata, AbcUser } from '@abc-map/shared-entities';
import { asyncHandler } from '../server/asyncHandler';
import { Status } from '../server/Status';
import { Authentication } from '../authentication/Authentication';
import { CompressedProject } from './CompressedProject';
import { AuthorizationService } from '../authorization/AuthorizationService';
import { HttpResponse } from '../server/HttpResponse';

export class ProjectController extends Controller {
  private authz: AuthorizationService;

  constructor(private services: Services) {
    super();
    this.authz = this.services.authorization;
  }

  public getRoot(): string {
    return '/projects';
  }

  public getRouter(): Router {
    // WARNING: memory storage can cause issues in case of high concurrency
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        headerPairs: 2,
        files: 1,
        fileSize: 1e7, // 10 MB
      },
    });

    const app = express();
    app.post('/', upload.single('project'), asyncHandler(this.save));
    app.get('/', asyncHandler(this.list));
    app.get('/:projectId', asyncHandler(this.findById));
    app.delete('/:projectId', asyncHandler(this.deleteById));
    return app;
  }

  public save = async (req: express.Request, res: express.Response): Promise<void> => {
    const metadata: AbcProjectMetadata | undefined = JSON.parse(req.body.metadata);
    if (!metadata?.id) {
      HttpResponse.badRequest(res, 'Project id is mandatory');
      return;
    }

    if (!(await this.authz.canWriteProject(req, metadata.id))) {
      HttpResponse.forbidden(res);
      return;
    }

    const user = Authentication.from(req) as AbcUser;
    const file = req.file.buffer;
    const project: CompressedProject = { metadata, project: file };

    const result: Status = await this.services.project.save(user.id, project).then(() => ({ status: 'saved' }));
    res.status(200).json(result);
  };

  public list = async (req: express.Request, res: express.Response): Promise<void> => {
    if (!(await this.authz.canListProjects(req))) {
      HttpResponse.forbidden(res);
      return;
    }

    const user = Authentication.from(req) as AbcUser;
    const result: AbcProjectMetadata[] = await this.services.project.list(user.id, 0, 50);
    res.status(200).json(result);
  };

  public findById = async (req: express.Request, res: express.Response): Promise<void> => {
    const projectId = req.params.projectId;
    if (!projectId) {
      HttpResponse.badRequest(res, 'Project id is mandatory');
      return;
    }

    if (!(await this.authz.canReadProject(req, projectId))) {
      HttpResponse.forbidden(res);
      return;
    }

    const result = await this.services.project.findById(projectId);
    if (!result) {
      res.status(404).send();
      return;
    }

    res.status(200).contentType('application/zip').end(result.project, 'binary');
  };

  public deleteById = async (req: express.Request, res: express.Response): Promise<void> => {
    const projectId = req.params.projectId;
    if (!projectId) {
      HttpResponse.badRequest(res, 'Project id is mandatory');
      return;
    }

    if (!(await this.authz.canDeleteProject(req, projectId))) {
      HttpResponse.forbidden(res);
      return;
    }

    await this.services.project.deleteById(projectId);
    res.status(200).json({ status: 'deleted' });
  };
}
