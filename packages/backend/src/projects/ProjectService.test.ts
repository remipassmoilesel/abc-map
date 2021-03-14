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
    client = new MongodbClient(config);
    await client.connect();

    service = ProjectService.create(config, client);
  });

  beforeEach(() => {
    userId = uuid();
  });

  after(() => {
    return client.disconnect();
  });

  describe('save()', () => {
    it('should fail without userId', async () => {
      const sampleProject = await TestHelper.sampleCompressedProject();

      const error: Error = await service.save('', sampleProject).catch((err) => err);
      assert.equal(error.message, 'User id is mandatory');
    });

    it('save() then findById()', async () => {
      const sampleProject = await TestHelper.sampleCompressedProject();

      await service.save(userId, sampleProject);

      const dbProject = await service.findById(sampleProject.metadata.id);
      assert.isDefined(dbProject);
      assert.equal(dbProject?.metadata.id, sampleProject.metadata.id);
      assert.equal(dbProject?.metadata.name, sampleProject.metadata.name);
      assert.deepEqual(dbProject?.metadata.projection, sampleProject.metadata.projection);
      assert.deepEqual(dbProject?.project, sampleProject.project);
    });

    it('save() should replace', async () => {
      const sampleProject = await TestHelper.sampleCompressedProject();
      await service.save(userId, sampleProject);

      sampleProject.metadata.name = 'Updated name';
      sampleProject.project = Buffer.from('updated content', 'utf-8');
      await service.save(userId, sampleProject);

      const dbProject = await service.findById(sampleProject.metadata.id);
      assert.equal(dbProject?.metadata.name, sampleProject.metadata.name);
      assert.deepEqual(dbProject?.project, sampleProject.project);
    });
  });

  describe('list()', () => {
    it('should work', async () => {
      const p1 = await TestHelper.sampleCompressedProject();
      await service.save(userId, p1);

      const dbProjects = await service.list(userId, 0, 10);

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
});
