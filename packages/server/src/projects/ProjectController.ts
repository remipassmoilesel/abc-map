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

import { Controller } from '../server/Controller';
import { Services } from '../services/services';
import { AbcProjectMetadata, AbcUser, CompressedProject, NodeBinary, ProjectConstants, ProjectSaveResponse, ProjectSaveStatus } from '@abc-map/shared';
import { Authentication } from '../authentication/Authentication';
import { AuthorizationService } from '../authorization/AuthorizationService';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyMultipart, { MultipartValue } from 'fastify-multipart';
import { ByIdParams, ByIdSchema, ListSchema } from './ProjectController.schemas';
import { Validation } from '../utils/Validation';
import { PaginatedQuery, PaginationHelper } from '../server/PaginationHelper';
import 'fastify-sensible';
import { Config } from '../config/Config';

export class ProjectController extends Controller {
  private authz: AuthorizationService;

  constructor(private config: Config, private services: Services) {
    super();
    this.authz = this.services.authorization;
  }

  public getRoot(): string {
    return '/projects';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    void app.register(fastifyMultipart, {
      limits: {
        fieldNameSize: 100,
        fieldSize: 10 * 1024,
        fields: 1,
        fileSize: ProjectConstants.MaxSizeBytes,
        files: 1,
        headerPairs: 50,
      },
    });
    app.post('/', this.save);
    app.get('/', { schema: ListSchema }, this.list);
    app.get('/:projectId', { schema: ByIdSchema }, this.findById);
    app.delete('/:projectId', { schema: ByIdSchema }, this.deleteById);
  };

  private save = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = Authentication.from(req);
    if (!user) {
      reply.forbidden();
      return;
    }

    const data = await req.file();

    const metadataField = data.fields['metadata'] as unknown as MultipartValue<string>;
    if (!metadataField.value) {
      reply.badRequest(`Invalid form data`);
      return;
    }

    const metadata: AbcProjectMetadata = JSON.parse(metadataField.value);
    if (!Validation.projectMetadata(metadata)) {
      reply.badRequest(`Invalid project metadata`);
      return;
    }

    if (!(await this.authz.canWriteProject(req, metadata.id))) {
      reply.forbidden();
      return;
    }

    const projectNumbers = await this.services.project.countByUserId(user.id);
    const projectsLeft = this.config.project.maxPerUser - projectNumbers;
    if (projectsLeft < 1) {
      const response: ProjectSaveResponse = { status: ProjectSaveStatus.LimitReached, projectsLeft };
      void reply.status(402).send(response);
      return;
    }

    const project: CompressedProject<NodeBinary> = { metadata, project: data.file };
    await this.services.project.save(user.id, project);

    const response: ProjectSaveResponse = { status: ProjectSaveStatus.Saved, projectsLeft };
    void reply.status(200).send(response);
  };

  private list = async (req: FastifyRequest<{ Querystring: PaginatedQuery }>, reply: FastifyReply): Promise<void> => {
    const { limit, offset } = PaginationHelper.fromQuery(req);

    if (!(await this.authz.canListProjects(req))) {
      reply.forbidden();
      return;
    }

    const user = Authentication.from(req) as AbcUser;
    const result = await this.services.project.list(user.id, offset, limit);
    void reply.status(200).send(result);
  };

  private findById = async (req: FastifyRequest<{ Params: ByIdParams }>, reply: FastifyReply): Promise<void> => {
    const projectId = req.params.projectId;
    if (!(await this.authz.canReadProject(req, projectId))) {
      reply.forbidden();
      return;
    }

    const result = await this.services.project.findById(projectId);
    if (!result) {
      reply.notFound();
      return;
    }

    void reply.status(200).send(result.project);
  };

  private deleteById = async (req: FastifyRequest<{ Params: ByIdParams }>, reply: FastifyReply): Promise<void> => {
    const projectId = req.params.projectId;
    if (!(await this.authz.canDeleteProject(req, projectId))) {
      reply.forbidden();
      return;
    }

    await this.services.project.deleteById(projectId);
    void reply.status(200).send({ status: 'deleted' });
  };
}
