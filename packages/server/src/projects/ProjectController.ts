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
import { AbcUser, ProjectConstants, ProjectSaveResponse, ProjectSaveStatus } from '@abc-map/shared';
import { Authentication } from '../authentication/Authentication';
import { AuthorizationService } from '../authorization/AuthorizationService';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyMultipart, { MultipartValue } from '@fastify/multipart';
import { ByIdParams, ByIdSchema, ListSchema } from './ProjectController.schemas';
import { Validation } from '../utils/Validation';
import { PaginatedQuery, PaginationHelper } from '../server/helpers/PaginationHelper';
import { Config } from '../config/Config';
import { CompressedProjectStream } from '@abc-map/shared';
import '@fastify/sensible';

export class ProjectController extends Controller {
  private authz: AuthorizationService;

  constructor(private config: Config, private services: Services) {
    super();
    this.authz = this.services.authorization;
  }

  public getRoot(): string {
    return '/api/projects';
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
    app.get('/shared/:projectId', { schema: ByIdSchema }, this.findSharedProjectById);
    app.get('/:projectId', { schema: ByIdSchema }, this.findById);
    app.delete('/:projectId', { schema: ByIdSchema }, this.deleteById);
    app.get('/quotas', this.getQuotas);
  };

  private save = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { project: projectService, metrics } = this.services;

    const user = Authentication.from(req);
    if (!user) {
      reply.forbidden();
      return;
    }

    const data = await req.file();
    if (!data) {
      reply.badRequest(`Invalid request`);
      return;
    }

    // Fastify multipart truncates data, so if we reached max project may be broken
    if (data.file.readableLength === ProjectConstants.MaxSizeBytes) {
      reply.payloadTooLarge('Max size allowed (bytes): ' + ProjectConstants.MaxSizeBytes);
      return;
    }

    const metadataField = data.fields['metadata'] as unknown as MultipartValue<string>;
    if (!metadataField.value) {
      reply.badRequest(`Invalid request`);
      return;
    }

    const metadata: unknown = JSON.parse(metadataField.value);
    if (!Validation.ProjectMetadata(metadata)) {
      reply.badRequest(`Invalid project metadata: ${Validation.formatErrors(Validation.ProjectMetadata)}`);
      return;
    }

    const [canWrite, isNewProject] = await this.authz.canWriteProject(req, metadata.id);
    if (!canWrite) {
      reply.forbidden();
      return;
    }

    // If project is new, we check that user can create a new project
    if (isNewProject) {
      const projectNumbers = await projectService.countByUserId(user.id);
      const projectsLeft = this.config.project.maxPerUser - projectNumbers;
      if (projectsLeft < 1) {
        const response: ProjectSaveResponse = { status: ProjectSaveStatus.LimitReached };
        void reply.status(402).send(response);
        return;
      }
    }

    const project: CompressedProjectStream = { metadata, project: data.file };
    await projectService.save(user.id, project);

    const response: ProjectSaveResponse = { status: ProjectSaveStatus.Saved };
    void reply.status(200).send(response);

    metrics.projectSaved();
  };

  private list = async (req: FastifyRequest<{ Querystring: PaginatedQuery }>, reply: FastifyReply): Promise<void> => {
    const { project, metrics } = this.services;
    const { limit, offset } = PaginationHelper.fromQuery(req);

    if (!(await this.authz.canListProjects(req))) {
      reply.forbidden();
      return;
    }

    const user = Authentication.from(req) as AbcUser;
    const result = await project.findByUserId(user.id, offset, limit);
    void reply.status(200).send(result);

    metrics.projectList();
  };

  private findById = async (req: FastifyRequest<{ Params: ByIdParams }>, reply: FastifyReply): Promise<unknown> => {
    const { project, metrics } = this.services;

    const projectId = req.params.projectId;
    if (!(await this.authz.canReadProject(req, projectId))) {
      reply.forbidden();
      return;
    }

    const result = await project.findStreamById(projectId);
    if (!result) {
      reply.notFound();
      return;
    }

    metrics.projectFetch();

    // We MUST return reply object, otherwise asynchronous response will not work.
    // See: https://www.fastify.io/docs/latest/Guides/Migration-Guide-V4/#need-to-return-reply-to-signal-a-fork-of-the-promise-chain
    void reply.header('Content-Type', 'application/octet-stream');
    return reply.send(result.project);
  };

  private findSharedProjectById = async (req: FastifyRequest<{ Params: ByIdParams }>, reply: FastifyReply): Promise<void> => {
    const { project, metrics } = this.services;

    const projectId = req.params.projectId;
    if (!(await this.authz.canReadSharedProject(req, projectId))) {
      reply.forbidden();
      return;
    }

    const result = await project.findStreamById(projectId);
    if (!result) {
      reply.notFound();
      return;
    }

    metrics.sharedProjectFetch();

    // We MUST return reply object, otherwise asynchronous response will not work.
    // See: https://www.fastify.io/docs/latest/Guides/Migration-Guide-V4/#need-to-return-reply-to-signal-a-fork-of-the-promise-chain
    void reply.header('Content-Type', 'application/octet-stream');
    return reply.send(result.project);
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

  private getQuotas = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!this.authz.canGetQuotas(req)) {
      reply.forbidden();
      return;
    }

    const user = Authentication.from(req) as AbcUser;

    const quotas = await this.services.project.getQuotasForUser(user.id);
    void reply.status(200).send(quotas);
  };
}
