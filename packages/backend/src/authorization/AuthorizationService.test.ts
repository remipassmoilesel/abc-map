import { MongodbClient } from '../mongodb/MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';
import { AuthorizationService } from './AuthorizationService';
import { Config } from '../config/Config';
import { ProjectDao } from '../projects/ProjectDao';
import { Request } from 'express';
import { AbcUser, AnonymousUser } from '@abc-map/shared-entities';
import * as uuid from 'uuid-random';
import { assert } from 'chai';
import { ProjectDocument } from '../projects/ProjectDocument';
import { TestHelper } from '../utils/TestHelper';

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

function authenticatedRequest(id?: string): Request {
  const user: AbcUser = {
    id: id || uuid(),
    email: 'fake-user@test',
    password: 'fake-password',
    enabled: true,
  };
  return ({ user } as unknown) as Request;
}

function anonymousRequest(): Request {
  const user: AbcUser = AnonymousUser;
  return ({ user } as unknown) as Request;
}
