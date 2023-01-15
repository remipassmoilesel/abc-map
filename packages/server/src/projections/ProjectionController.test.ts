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
import { assert } from 'chai';
import { Config } from '../config/Config';
import { TestAuthentication } from '../utils/TestAuthentication';
import { SinonStub } from 'sinon';
import * as sinon from 'sinon';

describe('ProjectionController', () => {
  let config: Config;
  let services: Services;
  let findByCodeStub: SinonStub;
  let testAuth: TestAuthentication;
  let server: HttpServer;

  before(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;
    config.server.log.warnings = false;

    services = await servicesFactory(config);

    findByCodeStub = sinon.stub();
    services.projections.findByCode = findByCodeStub;

    server = HttpServer.create(config, services);
    await server.initialize();

    testAuth = new TestAuthentication(services);
  });

  after(async () => {
    await services.shutdown();
    await server.shutdown();
  });

  describe('GET /api/projections/:code', () => {
    it('should fail for non connected user', async () => {
      // Act
      const res = await server.getApp().inject({
        url: '/api/projections/4326',
        method: 'GET',
      });

      // Assert
      assert.equal(res.statusCode, 403);
    });

    it('should work for anonymous user', async () => {
      // Prepare
      findByCodeStub.resolves({ code: 4326 });

      // Act
      const res = await server.getApp().inject({
        url: '/api/projections/4326',
        method: 'GET',
        headers: {
          ...testAuth.anonymous(),
        },
      });

      // Assert
      assert.equal(res.statusCode, 200);
      assert.equal(res.body, JSON.stringify({ code: 4326 }));
    });
  });
});
