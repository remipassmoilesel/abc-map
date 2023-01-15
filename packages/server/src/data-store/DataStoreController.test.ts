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

import { disableSmtpClientLogging } from '../email/SmtpClient';
import { Config } from '../config/Config';
import { Services, servicesFactory } from '../services/services';
import { HttpServer } from '../server/HttpServer';
import { ConfigLoader } from '../config/ConfigLoader';
import { TestHelper } from '../utils/TestHelper';
import { assert } from 'chai';
import { IncomingHttpHeaders } from 'http';
import * as uuid from 'uuid-random';
import { TestAuthentication } from '../utils/TestAuthentication';
import { ArtefactFilter } from '@abc-map/shared';

disableSmtpClientLogging();

describe('DataStoreController', () => {
  let config: Config;
  let services: Services;
  let server: HttpServer;
  let authentication: IncomingHttpHeaders;

  before(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;
    config.server.log.warnings = false;
    services = await servicesFactory(config);
    server = HttpServer.create(config, services);
    await server.initialize();

    const auth = new TestAuthentication(services);
    authentication = auth.connectedUser();
  });

  after(async () => {
    await services.shutdown();
    await server.shutdown();
  });

  describe('GET /datastore/list', () => {
    it('should fail with invalid request', async () => {
      // Act
      const response = await server.getApp().inject({
        method: 'GET',
        path: '/api/datastore/list',
      });

      // Assert
      assert.equal(response.statusCode, 403);
      assert.equal(response.body, '{"statusCode":403,"error":"Forbidden","message":"Forbidden"}');
    });

    it('should work with valid request', async () => {
      // Act
      const response = await server.getApp().inject({
        method: 'GET',
        path: '/api/datastore/list',
        query: {
          limit: '10',
          offset: '0',
          filter: ArtefactFilter.OnlyVectors,
        },
        headers: authentication,
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });

  describe('GET /datastore/search', () => {
    it('should fail with invalid request', async () => {
      // Act
      const response = await server.getApp().inject({
        method: 'GET',
        path: '/api/datastore/search',
      });

      // Assert
      assert.equal(response.statusCode, 403);
      assert.equal(response.body, '{"statusCode":403,"error":"Forbidden","message":"Forbidden"}');
    });

    it('should work with valid request', async () => {
      // Act
      const response = await server.getApp().inject({
        method: 'GET',
        path: '/api/datastore/search',
        query: {
          query: 'test query',
          lang: 'en',
          filter: ArtefactFilter.OnlyVectors,
        },
        headers: authentication,
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });

  describe('GET /datastore/:artefactId', () => {
    it('should fail with invalid request', async () => {
      // Act
      const response = await server.getApp().inject({
        method: 'GET',
        path: `/api/datastore/${uuid()}`,
      });

      // Assert
      assert.equal(response.statusCode, 403);
      assert.equal(response.body, '{"statusCode":403,"error":"Forbidden","message":"Forbidden"}');
    });

    it('should work with valid request', async () => {
      // Prepare
      const artefact = TestHelper.sampleArtefact();
      await services.datastore.saveAll([artefact]);

      // Act
      const response = await server.getApp().inject({
        method: 'GET',
        path: `/api/datastore/${artefact.id}`,
        headers: authentication,
      });

      // Assert
      assert.equal(response.statusCode, 200);
    });
  });
});
