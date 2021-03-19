import { AbstractService } from '../services/AbstractService';
import { Logger } from '../utils/Logger';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ProjectDao } from '../projects/ProjectDao';
import { Request } from 'express';
import { Authentication } from '../authentication/Authentication';
import { isUserAnonymous } from '@abc-map/shared-entities';

const logger = Logger.get('AuthorizationService.ts');

export class AuthorizationService extends AbstractService {
  public static create(mongodb: MongodbClient): AuthorizationService {
    return new AuthorizationService(new ProjectDao(mongodb));
  }

  constructor(private project: ProjectDao) {
    super();
  }

  public async canListProjects(req: Request): Promise<boolean> {
    const user = Authentication.from(req);
    if (!user) {
      return false;
    }

    return !isUserAnonymous(user);
  }

  public async canReadProject(req: Request, projectId: string): Promise<boolean> {
    const user = Authentication.from(req);
    if (!user) {
      return false;
    }

    if (isUserAnonymous(user)) {
      return false;
    }

    const project = await this.project.findMetadataById(projectId);
    if (!project) {
      return false;
    }

    return project.ownerId === user.id;
  }

  public async canWriteProject(req: Request, projectId: string): Promise<boolean> {
    const user = Authentication.from(req);
    if (!user) {
      return false;
    }

    if (isUserAnonymous(user)) {
      return false;
    }

    const project = await this.project.findMetadataById(projectId);
    if (!project) {
      // If project does not exists, user can create a new one
      return true;
    }

    return project.ownerId === user.id;
  }

  public async canDeleteProject(req: Request, projectId: string): Promise<boolean> {
    const user = Authentication.from(req);
    if (!user) {
      return false;
    }

    if (isUserAnonymous(user)) {
      return false;
    }

    const project = await this.project.findMetadataById(projectId);
    if (!project) {
      return false;
    }

    return project.ownerId === user.id;
  }
}
