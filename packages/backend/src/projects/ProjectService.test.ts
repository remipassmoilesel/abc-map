import { ProjectService } from './ProjectService';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ConfigLoader } from '../config/ConfigLoader';
import { TestHelper } from '../utils/TestHelper';
import { assert } from 'chai';
import * as uuid from 'uuid-random';

describe('ProjectService', () => {
  let userId: string;
  let client: MongodbClient;
  let service: ProjectService;

  before(async () => {
    const config = await ConfigLoader.load();
    client = await MongodbClient.createAndConnect(config);

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
      assert.deepEqual(dbProject?.metadata.projection, sampleProject.metadata.projection);
      assert.deepEqual(dbProject?.project, sampleProject.project);
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
      assert.deepEqual(dbProject?.project, sampleProject.project);
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
      assert.deepEqual(dbProject?.metadata.projection, project.metadata.projection);
      assert.deepEqual(dbProject?.project, project.project);
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

  describe('delete()', () => {
    it('should work', async () => {
      // Prepare
      const p1 = await TestHelper.sampleCompressedProject();
      await service.save(userId, p1);

      // Act
      await service.deleteById(p1.metadata.id);

      // Assert
      const dbProject = await service.findById(p1.metadata.id);
      assert.isUndefined(dbProject);
    });

    it('should fail', async () => {
      // Prepare
      const p1 = await TestHelper.sampleCompressedProject();

      // Act
      const error: Error = await service.deleteById(p1.metadata.id).catch((err) => err);

      // Assert
      assert.instanceOf(error, Error);
      assert.match(error.message, /Invalid file/);
    });
  });
});
