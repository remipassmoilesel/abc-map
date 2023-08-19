/**
 * Copyright © 2023 Rémi Pace.
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

import { AbstractService } from '../services/AbstractService';
import { Logger } from '@abc-map/shared';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ProjectDao } from '../projects/ProjectDao';
import { Authentication } from '../authentication/Authentication';
import { isUserAnonymous } from '@abc-map/shared';
import { FastifyRequest } from 'fastify';

const logger = Logger.get('AuthorizationService.ts');

export class AuthorizationService extends AbstractService {
  public static create(mongodb: MongodbClient): AuthorizationService {
    return new AuthorizationService(new ProjectDao(mongodb));
  }

  constructor(private project: ProjectDao) {
    super();
  }

  /**
   * Here we do not verify owner of project, user id will be used as filter.
   * @param req
   */
  public async canListProjects(req: FastifyRequest): Promise<boolean> {
    const user = Authentication.from(req);
    if (!user) {
      return false;
    }

    return !isUserAnonymous(user);
  }

  public async canReadProject(req: FastifyRequest, projectId: string): Promise<boolean> {
    const user = Authentication.from(req);
    if (!user) {
      return false;
    }

    const metadata = await this.project.findMetadataById(projectId);
    if (!metadata) {
      return false;
    }

    return metadata.ownerId === user.id;
  }

  public async canReadSharedProject(req: FastifyRequest, projectId: string): Promise<boolean> {
    const user = Authentication.from(req);
    if (!user) {
      return false;
    }

    const metadata = await this.project.findMetadataById(projectId);
    if (!metadata) {
      return false;
    }

    return metadata.public;
  }

  /**
   * Return [true if user can write, true] if project is new
   * @param req
   * @param projectId
   */
  public async canWriteProject(req: FastifyRequest, projectId: string): Promise<[boolean, boolean]> {
    const user = Authentication.from(req);
    if (!user) {
      return [false, false];
    }

    if (isUserAnonymous(user)) {
      return [false, false];
    }

    const project = await this.project.findMetadataById(projectId);
    if (!project) {
      // If project does not exist, user can create a new one
      return [true, true];
    }

    return [project.ownerId === user.id, false];
  }

  public async canDeleteProject(req: FastifyRequest, projectId: string): Promise<boolean> {
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

  public canGetQuotas(req: FastifyRequest): boolean {
    const user = Authentication.from(req);
    if (!user) {
      return false;
    }

    return !isUserAnonymous(user);
  }
}
