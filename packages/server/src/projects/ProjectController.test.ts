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

import { HttpServer } from '../server/HttpServer';
import { Services, servicesFactory } from '../services/services';
import { ConfigLoader } from '../config/ConfigLoader';
import { TestHelper } from '../utils/TestHelper';
import { assert } from 'chai';
import { Config } from '../config/Config';
import * as FormData from 'form-data';
import { TestAuthentication } from '../utils/TestAuthentication';
import { AbcProjectMetadata, AbcUser, CompressedProject, ProjectConstants } from '@abc-map/shared';
import { IncomingHttpHeaders } from 'http';
import { StreamReader } from '../utils/StreamReader';
import ReadableStream = NodeJS.ReadableStream;
import * as _ from 'lodash';

describe('ProjectController', () => {
  let config: Config;
  let services: Services;
  let testAuth: TestAuthentication;
  let user1: AbcUser;
  let user2: AbcUser;
  let user1Auth: IncomingHttpHeaders;
  let project1: CompressedProject;
  let project2: CompressedProject;
  let server: HttpServer;

  before(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;

    services = await servicesFactory(config);
    server = HttpServer.create(config, services);
    await server.initialize();

    testAuth = new TestAuthentication(services);
  });

  beforeEach(async () => {
    user1 = TestHelper.sampleUser();
    user2 = TestHelper.sampleUser();
    await services.user.save(user1);
    await services.user.save(user2);

    project1 = await TestHelper.sampleCompressedProject();
    project2 = await TestHelper.sampleCompressedProject();
    await services.project.save(user1.id, project1);
    await services.project.save(user2.id, project2);

    const token = services.authentication.signAuthenticationToken(user1);
    user1Auth = {
      Authorization: `Bearer ${token}`,
    };
  });

  after(async () => {
    await services.shutdown();
    await server.shutdown();
  });

  describe('POST /api/projects/', () => {
    it('should fail for non connected user', async () => {
      // Prepare
      const project = await TestHelper.sampleCompressedProject();
      const form = new FormData();
      form.append('metadata', JSON.stringify(project.metadata));
      form.append('project', project.project);

      // Act
      const res = await server.getApp().inject({
        url: '/api/projects',
        method: 'POST',
        payload: form,
        headers: form.getHeaders(),
      });

      // Assert
      assert.equal(res.statusCode, 403);
    });

    it('should fail for anonymous user', async () => {
      // Prepare
      const project = await TestHelper.sampleCompressedProject();
      const form = new FormData();
      form.append('metadata', JSON.stringify(project.metadata));
      form.append('project', project.project);

      // Act
      const res = await server.getApp().inject({
        url: '/api/projects',
        method: 'POST',
        payload: form,
        headers: {
          ...form.getHeaders(),
          ...testAuth.anonymous(),
        },
      });

      // Assert
      assert.equal(res.statusCode, 403);
    });

    it('should work for connected user', async () => {
      // Prepare
      const project = await TestHelper.sampleCompressedProject();
      const form = new FormData();
      form.append('metadata', JSON.stringify(project.metadata));
      form.append('project', project.project);

      // Act
      const res = await server.getApp().inject({
        url: '/api/projects',
        method: 'POST',
        payload: form,
        headers: {
          ...form.getHeaders(),
          ...user1Auth,
        },
      });

      // Assert
      assert.equal(res.statusCode, 200);
      // If fastify setup is borked, file streams are empty
      // Here we check that file is well sent to BDD
      const dbProject = await services.project.findById(project.metadata.id);
      const buffer = await StreamReader.read(dbProject?.project as ReadableStream);
      assert.deepEqual(buffer, project.project);
    });

    it('should fail if metadata field is too big', async () => {
      // Prepare
      const project = await TestHelper.sampleCompressedProject();
      const heavyMeta = _.range(1, 70).map(() => project.metadata);
      const form = new FormData();
      form.append('metadata', JSON.stringify(heavyMeta));
      form.append('project', project.project);

      // Act
      const res = await server.getApp().inject({
        url: '/api/projects',
        method: 'POST',
        payload: form,
        headers: {
          ...form.getHeaders(),
          ...user1Auth,
        },
      });

      // Assert
      // If field is too heavy, content will truncated and will not pass parsing
      assert.equal(res.statusCode, 500);
      assert.equal(res.body, '{"statusCode":500,"error":"Internal Server Error","message":"Unexpected end of JSON input"}');
    });

    it('should fail if project is too big', async () => {
      // Prepare
      const project = await TestHelper.sampleCompressedProject();
      const heavyProject = Buffer.from(_.range(1, ProjectConstants.MaxSizeBytes + 1000).map(() => 128));
      const form = new FormData();
      form.append('metadata', JSON.stringify(project.metadata));
      form.append('project', heavyProject);

      // Act
      const res = await server.getApp().inject({
        url: '/api/projects',
        method: 'POST',
        payload: form,
        headers: {
          ...form.getHeaders(),
          ...user1Auth,
        },
      });

      // Assert
      assert.equal(res.statusCode, 413);
      assert.equal(
        res.body,
        '{"statusCode":413,"code":"FST_REQ_FILE_TOO_LARGE","error":"Payload Too Large","message":"request file too large, please check multipart config"}'
      );
    });

    it('should not work with bad request', async () => {
      // Prepare
      const project = await TestHelper.sampleCompressedProject();
      const form = new FormData();
      form.append('metadata', JSON.stringify({ ...project.metadata, wrongField: 'wrongValue' }));
      form.append('project', project.project);

      // Act
      const res = await server.getApp().inject({
        url: '/api/projects',
        method: 'POST',
        payload: form,
        headers: {
          ...form.getHeaders(),
          ...user1Auth,
        },
      });

      // Assert
      assert.equal(res.statusCode, 400);
      assert.isTrue(res.body.startsWith('{"statusCode":400,"error":"Bad Request","message":"Invalid project metadata'));
    });
  });

  describe('GET /api/projects/', () => {
    it('should fail for non connected user', async () => {
      const res = await server.getApp().inject({
        url: '/api/projects',
        method: 'GET',
      });

      assert.equal(res.statusCode, 403);
    });

    it('should fail for anonymous user', async () => {
      const res = await server.getApp().inject({
        url: '/api/projects',
        method: 'GET',
        headers: {
          ...testAuth.anonymous(),
        },
      });

      assert.equal(res.statusCode, 403);
    });

    it('should work for connected user', async () => {
      // Act
      const res = await server.getApp().inject({
        url: '/api/projects',
        method: 'GET',
        headers: user1Auth,
      });

      assert.equal(res.statusCode, 200);
      const list: AbcProjectMetadata[] = JSON.parse(res.body);
      assert.lengthOf(list, 1);
      assert.equal(list[0].id, project1.metadata.id);
    });
  });

  describe('GET /api/projects/:projectId', () => {
    it('should fail for non connected user', async () => {
      const res = await server.getApp().inject({
        url: `/api/projects/${project1.metadata.id}`,
        method: 'GET',
      });

      assert.equal(res.statusCode, 403);
    });

    it('should fail for anonymous user', async () => {
      const res = await server.getApp().inject({
        url: `/api/projects/${project1.metadata.id}`,
        method: 'GET',
        headers: { ...testAuth.anonymous() },
      });

      assert.equal(res.statusCode, 403);
    });

    it('should work for connected user if owner', async () => {
      // Act
      const res = await server.getApp().inject({
        url: `/api/projects/${project1.metadata.id}`,
        method: 'GET',
        headers: user1Auth,
      });

      assert.equal(res.statusCode, 200);
    });

    it('should fail for connected user if not owner', async () => {
      // Act
      const res = await server.getApp().inject({
        url: `/api/projects/${project2.metadata.id}`,
        method: 'GET',
        headers: user1Auth,
      });

      assert.equal(res.statusCode, 403);
    });

    it('should fail for public project with anonymous user', async () => {
      // Prepare
      // Anonymous users should not be able to access project via this route
      const project3 = await TestHelper.sampleCompressedProject();
      project3.metadata.public = true;
      await services.project.save(user1.id, project3);

      // Act
      const res = await server.getApp().inject({
        url: `/api/projects/${project3.metadata.id}`,
        method: 'GET',
        headers: { ...testAuth.anonymous() },
      });

      assert.equal(res.statusCode, 403);
    });

    it('should fail for public project with connected user', async () => {
      // Prepare
      // Users should not be able to access project of other users via this route
      const project3 = await TestHelper.sampleCompressedProject();
      project3.metadata.public = true;
      await services.project.save(user2.id, project3);

      // Act
      const res = await server.getApp().inject({
        url: `/api/projects/${project3.metadata.id}`,
        method: 'GET',
        headers: user1Auth,
      });

      assert.equal(res.statusCode, 403);
    });
  });

  describe('GET /api/projects/shared/:projectId', () => {
    it('should fail for non connected user and private project', async () => {
      const res = await server.getApp().inject({
        url: `/api/projects/shared/${project1.metadata.id}`,
        method: 'GET',
      });

      assert.equal(res.statusCode, 403);
    });

    it('should fail for non connected user and public project', async () => {
      const project3 = await TestHelper.sampleCompressedProject();
      project3.metadata.public = true;
      await services.project.save(user1.id, project3);

      // Act
      const res = await server.getApp().inject({
        url: `/api/projects/shared/${project3.metadata.id}`,
        method: 'GET',
      });

      assert.equal(res.statusCode, 403);
    });

    it('should fail for private project with anonymous user', async () => {
      const res = await server.getApp().inject({
        url: `/api/projects/shared/${project1.metadata.id}`,
        method: 'GET',
        headers: { ...testAuth.anonymous() },
      });

      assert.equal(res.statusCode, 403);
    });

    it('should work for public project with anonymous user', async () => {
      const project3 = await TestHelper.sampleCompressedProject();
      project3.metadata.public = true;
      await services.project.save(user1.id, project3);

      // Act
      const res = await server.getApp().inject({
        url: `/api/projects/shared/${project3.metadata.id}`,
        method: 'GET',
        headers: { ...testAuth.anonymous() },
      });

      assert.equal(res.statusCode, 200);
    });

    it('should work for public project with connected user', async () => {
      const project3 = await TestHelper.sampleCompressedProject();
      project3.metadata.public = true;
      await services.project.save(user2.id, project3);

      // Act
      const res = await server.getApp().inject({
        url: `/api/projects/shared/${project3.metadata.id}`,
        method: 'GET',
        headers: user1Auth,
      });

      assert.equal(res.statusCode, 200);
    });
  });

  describe('DELETE /api/projects/:projectId', () => {
    it('should fail for non connected user', async () => {
      const res = await server.getApp().inject({
        url: `/api/projects/${project1.metadata.id}`,
        method: 'DELETE',
      });

      assert.equal(res.statusCode, 403);
    });

    it('should fail for anonymous user', async () => {
      const res = await server.getApp().inject({
        url: `/api/projects/${project1.metadata.id}`,
        method: 'DELETE',
        headers: {
          ...testAuth.anonymous(),
        },
      });

      assert.equal(res.statusCode, 403);
    });

    it('should work for connected user if owner', async () => {
      // Act
      const res = await server.getApp().inject({
        url: `/api/projects/${project1.metadata.id}`,
        method: 'DELETE',
        headers: user1Auth,
      });

      assert.equal(res.statusCode, 200);
    });

    it('should fail for connected user if not owner', async () => {
      // Act
      const res = await server.getApp().inject({
        url: `/api/projects/${project2.metadata.id}`,
        method: 'DELETE',
        headers: user1Auth,
      });

      assert.equal(res.statusCode, 403);
    });
  });
});
