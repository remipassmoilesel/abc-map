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

import { ProjectService } from './ProjectService';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';
import { TestHelper } from '../utils/TestHelper';
import { assert } from 'chai';
import * as uuid from 'uuid-random';
import { StreamReader } from '../utils/StreamReader';
import ReadableStream = NodeJS.ReadableStream;
import { Readable } from 'stream';
import { CompressedProject } from '@abc-map/shared';
import { UserService } from '../users/UserService';

describe('ProjectService', () => {
  let userId: string;
  let client: MongodbClient;
  let userService: UserService;
  let service: ProjectService;

  before(async () => {
    const config = await ConfigLoader.load();
    client = await MongodbClient.createAndConnect(config);
    userService = UserService.create(config, client);

    service = ProjectService.create(config, client);
  });

  beforeEach(() => {
    userId = uuid();
  });

  after(() => {
    return client.disconnect();
  });

  describe('save()', () => {
    it('save() then findById()', async () => {
      // Prepare
      const sampleProject = await TestHelper.sampleCompressedProject();

      // Act
      await service.save(userId, sampleProject);

      // Assert
      const dbProject = await service.findById(sampleProject.metadata.id);
      assert.isDefined(dbProject);
      assert.equal(dbProject?.metadata.id, sampleProject.metadata.id);
      assert.equal(dbProject?.metadata.name, sampleProject.metadata.name);
      assert.isDefined(dbProject?.project);
    });

    it('save() buffer should work', async () => {
      // Prepare
      const sampleProject = await TestHelper.sampleCompressedProject();

      // Act
      await service.save(userId, sampleProject);

      // Assert
      const dbProject = await service.findById(sampleProject.metadata.id);
      assert.isDefined(dbProject?.project);
      const buffer = await StreamReader.read(dbProject?.project as ReadableStream);
      assert.deepEqual(buffer, sampleProject.project);
    });

    it('save() stream should work', async () => {
      // Prepare
      const sampleProject = await TestHelper.sampleCompressedProject();
      const streamProject: CompressedProject = {
        ...sampleProject,
        project: Readable.from(sampleProject.project),
      };

      // Act
      await service.save(userId, streamProject);

      // Assert
      const dbProject = await service.findById(sampleProject.metadata.id);
      assert.isDefined(dbProject?.project);
      const buffer = await StreamReader.read(dbProject?.project as ReadableStream);
      assert.deepEqual(buffer, sampleProject.project);
    });

    it('should fail without userId', async () => {
      // Prepare
      const sampleProject = await TestHelper.sampleCompressedProject();

      // Act
      const error: Error = await service.save('', sampleProject).catch((err) => err);

      // Assert
      assert.equal(error.message, 'Owner id is mandatory');
    });

    it('save() should replace', async () => {
      // Prepare
      const sampleProject = await TestHelper.sampleCompressedProject();
      await service.save(userId, sampleProject);
      sampleProject.metadata.name = 'Updated name';
      sampleProject.project = Buffer.from('updated content', 'utf-8');

      // Act
      await service.save(userId, sampleProject);

      // Assert
      const dbProject = await service.findById(sampleProject.metadata.id);
      assert.equal(dbProject?.metadata.name, sampleProject.metadata.name);
      const buffer = await StreamReader.read(dbProject?.project as ReadableStream);
      assert.deepEqual(buffer, sampleProject.project);
    });
  });

  describe('findById()', () => {
    it('should return project', async () => {
      // Prepare
      const project = await TestHelper.sampleCompressedProject();
      await service.save(userId, project);

      // Act
      const dbProject = await service.findById(project.metadata.id);

      // Assert
      assert.isDefined(dbProject);
      assert.equal(dbProject?.metadata.id, project.metadata.id);
      assert.equal(dbProject?.metadata.name, project.metadata.name);
      assert.isDefined(dbProject?.project);
      const buffer = await StreamReader.read(dbProject?.project as ReadableStream);
      assert.deepEqual(buffer, project.project);
    });

    it('should return undefined', async () => {
      // Act
      const dbProject = await service.findById(uuid());

      // Assert
      assert.isUndefined(dbProject);
    });
  });

  describe('list()', () => {
    it('should work', async () => {
      // Prepare
      const p1 = await TestHelper.sampleCompressedProject();
      await service.save(userId, p1);

      // Act
      const dbProjects = await service.list(userId, 0, 10);

      // Assert
      assert.lengthOf(dbProjects, 1);
      assert.deepEqual(dbProjects[0], p1.metadata);
    });

    it('should serve only projects with specified user id', async () => {
      const p1 = await TestHelper.sampleCompressedProject();
      const p2 = await TestHelper.sampleCompressedProject();
      const p3 = await TestHelper.sampleCompressedProject();
      await service.save(userId, p1);
      await service.save(userId, p2);
      await service.save(uuid(), p3);

      const dbProjects = await service.list(userId, 0, 10);

      assert.deepEqual(dbProjects.map((p) => p.id).sort(), [p1.metadata.id, p2.metadata.id].sort());
    });
  });

  it('delete()', async () => {
    // Prepare
    const p1 = await TestHelper.sampleCompressedProject();
    await service.save(userId, p1);

    // Act
    await service.deleteById(p1.metadata.id);

    // Assert
    const dbProject = await service.findById(p1.metadata.id);
    assert.isUndefined(dbProject);
  });

  it('deleteByUserId()', async () => {
    // Prepare
    const user1 = TestHelper.sampleUser();
    await userService.save(user1);
    const user2 = TestHelper.sampleUser();
    await userService.save(user2);

    const p1 = await TestHelper.sampleCompressedProject();
    const p2 = await TestHelper.sampleCompressedProject();
    const p3 = await TestHelper.sampleCompressedProject();
    await service.save(user1.id, p1);
    await service.save(user1.id, p2);
    await service.save(user2.id, p3);

    // Act
    await service.deleteByUserId(user1.id);

    // Assert
    const project1 = await service.findById(p1.metadata.id);
    assert.isUndefined(project1);
    const project2 = await service.findById(p2.metadata.id);
    assert.isUndefined(project2);
    const project3 = await service.findById(p3.metadata.id);
    assert.isDefined(project3);
  });
});
