import { ProjectService } from './ProjectService';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ProjectDao } from './ProjectDao';
import { AbcProject } from '@abc-map/shared-entities';
import { ConfigLoader } from '../config/ConfigLoader';
import { TestHelper } from '../utils/TestHelper';
import { assert } from 'chai';

describe('ProjectService', () => {
  let service: ProjectService;
  let client: MongodbClient;

  before(async () => {
    const config = await ConfigLoader.load();
    client = new MongodbClient(config);
    await client.connect();

    service = new ProjectService(config, new ProjectDao(config, client));
  });

  after(async () => {
    return client.disconnect();
  });

  it('save() then findById()', async () => {
    const sampleProject: AbcProject = TestHelper.sampleProject();
    await service.save(sampleProject);
    const dbProject = await service.findById(sampleProject.id);
    assert.isDefined(dbProject);
    assert.isDefined(dbProject?.id);
    assert.isDefined(dbProject?.name);
    assert.isDefined(dbProject?.layers);
    assert.isDefined(dbProject?.projection);
    assert.deepEqual(dbProject, sampleProject);
  });

  it('list() then findById()', async () => {
    const p1: AbcProject = TestHelper.sampleProject();
    const p2: AbcProject = TestHelper.sampleProject();
    await service.save(p1);
    await service.save(p2);
    const dbProjects = await service.list(0, 10);

    assert.isAtLeast(dbProjects.length, 2);
    dbProjects.forEach((project) => {
      assert.isDefined(project);
      assert.isDefined(project?.id);
      assert.isDefined(project?.name);
      assert.isDefined(project?.layers);
      assert.isDefined(project?.projection);
    });
  });
});
