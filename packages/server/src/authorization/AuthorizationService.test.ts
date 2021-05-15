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

import { MongodbClient } from '../mongodb/MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';
import { AuthorizationService } from './AuthorizationService';
import { Config } from '../config/Config';
import { ProjectDao } from '../projects/ProjectDao';
import { AnonymousUser, Token, UserStatus } from '@abc-map/shared-entities';
import * as uuid from 'uuid-random';
import { assert } from 'chai';
import { ProjectDocument } from '../projects/ProjectDocument';
import { TestHelper } from '../utils/TestHelper';
import { FastifyRequest } from 'fastify';

// TODO: terminate tests
// TODO: double-check tests

describe('AuthorizationService', () => {
  let config: Config;
  let client: MongodbClient;
  let projectDao: ProjectDao;
  let service: AuthorizationService;

  before(async () => {
    config = await ConfigLoader.load();
    client = await MongodbClient.createAndConnect(config);
    projectDao = new ProjectDao(client);

    service = AuthorizationService.create(client);
    await service.init();
  });

  after(() => client.disconnect());

  describe('canListProjects()', () => {
    it('anonymous cannot', async () => {
      // Prepare
      const req = anonymousRequest();

      // Act, assert
      assert.isFalse(await service.canListProjects(req));
    });

    it('authenticated user can', async () => {
      // Prepare
      const req = authenticatedRequest();

      // Act, assert
      assert.isTrue(await service.canListProjects(req));
    });
  });

  describe('canWriteProject()', () => {
    it('anonymous cannot', async () => {
      // Prepare
      const req = anonymousRequest();

      // Act, assert
      assert.isFalse(await service.canWriteProject(req, uuid()));
    });

    it('authenticated user can write non existing project', async () => {
      // Prepare
      const req = authenticatedRequest();

      // Act, assert
      assert.isTrue(await service.canWriteProject(req, uuid()));
    });

    it('authenticated user can write its own project', async () => {
      // Prepare
      const ownerId = uuid();
      const project: ProjectDocument = {
        ...TestHelper.sampleProjectDocument(),
        ownerId,
      };
      await projectDao.saveMetadata(project);
      const req = authenticatedRequest(ownerId);

      // Act, assert
      assert.isTrue(await service.canWriteProject(req, uuid()));
    });

    it('authenticated user cannot write other project', async () => {
      // Prepare
      const ownerId = uuid();
      const project = TestHelper.sampleProjectDocument();
      await projectDao.saveMetadata(project);
      const req = authenticatedRequest(ownerId);

      // Act, assert
      assert.isTrue(await service.canWriteProject(req, uuid()));
    });
  });

  describe('canDeleteProject()', () => {
    it('anonymous cannot', async () => {
      // Prepare
      const req = anonymousRequest();

      // Act, assert
      assert.isFalse(await service.canDeleteProject(req, uuid()));
    });

    it('authenticated user can delete its own project', async () => {
      // Prepare
      const ownerId = uuid();
      const project: ProjectDocument = {
        ...TestHelper.sampleProjectDocument(),
        ownerId,
      };
      await projectDao.saveMetadata(project);
      const req = authenticatedRequest(ownerId);

      // Act, assert
      assert.isTrue(await service.canDeleteProject(req, project._id));
    });

    it('authenticated user cannot delete other project', async () => {
      // Prepare
      const ownerId = uuid();
      const project = TestHelper.sampleProjectDocument();
      await projectDao.saveMetadata(project);
      const req = authenticatedRequest(ownerId);

      // Act, assert
      assert.isFalse(await service.canDeleteProject(req, project._id));
    });
  });
});

function authenticatedRequest(id?: string): FastifyRequest {
  const token: Token = {
    user: {
      id: id || uuid(),
      email: 'fake-user@test',
      password: 'fake-password',
      enabled: true,
    },
    userStatus: UserStatus.Authenticated,
  };

  return ({ user: token } as unknown) as FastifyRequest;
}

function anonymousRequest(): FastifyRequest {
  const token: Token = { user: AnonymousUser, userStatus: UserStatus.Anonymous };
  return ({ user: token } as unknown) as FastifyRequest;
}
