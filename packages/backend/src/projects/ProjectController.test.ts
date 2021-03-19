import { HttpServer } from '../server/HttpServer';
import { Services, servicesFactory } from '../services/services';
import { ConfigLoader } from '../config/ConfigLoader';
import * as request from 'supertest';
import { Application } from 'express';
import { TestHelper } from '../utils/TestHelper';
import { TestAuthentication } from '../utils/TestAuthentication';
import { assert } from 'chai';

// TODO: terminate tests
// TODO: double-check tests

describe('ProjectController', () => {
  let services: Services;
  let auth: TestAuthentication;
  let app: Application;

  before(async () => {
    const config = await ConfigLoader.load();
    services = await servicesFactory(config);
    auth = new TestAuthentication(services);
    app = HttpServer.create(config, services).getApp();
  });

  after(() => services.shutdown());

  describe('POST /api/projects/', () => {
    it('should fail for non connected', async () => {
      const project = await TestHelper.sampleCompressedProject();

      await request(app)
        .post('/api/projects/')
        .set('Content-Type', 'multipart/form-data')
        .field('metadata', JSON.stringify(project.metadata))
        .attach('project', project.project, 'project.zip')
        .expect(401);
    });

    it('should fail for anonymous user', async () => {
      const project = await TestHelper.sampleCompressedProject();

      await request(app)
        .post('/api/projects/')
        .set('Authorization', auth.anonymous())
        .set('Content-Type', 'multipart/form-data')
        .field('metadata', JSON.stringify(project.metadata))
        .attach('project', project.project, 'project.zip')
        .expect(403);
    });

    it('should work for connected user', async () => {
      const project = await TestHelper.sampleCompressedProject();

      await request(app)
        .post('/api/projects/')
        .set('Authorization', auth.connectedUser())
        .set('Content-Type', 'multipart/form-data')
        .field('metadata', JSON.stringify(project.metadata))
        .attach('project', project.project, 'project.zip')
        .expect(200);

      const dbProject = await services.project.findById(project.metadata.id);
      assert.isDefined(dbProject);
    });
  });
});
