/**
 * Copyright © 2026 Rémi Pace.
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

import { HttpServer } from '../server/HttpServer.js';
import type { Services } from '../services/services.js';
import { servicesFactory } from '../services/services.js';
import { ConfigLoader } from '../config/ConfigLoader.js';
import type { Config } from '../config/Config.js';
import { TestAuthentication } from '../utils/TestAuthentication.js';
import type { GetPointIconsResponse } from '@abc-map/shared';
import { afterAll, assert, beforeAll, describe, expect, it } from 'vitest';
import { disableIntegrationTestLogs } from '../utils/disableIntegrationTestLogs.js';

disableIntegrationTestLogs();

describe('PointIconsController', () => {
  let config: Config;
  let services: Services;
  let testAuth: TestAuthentication;
  let server: HttpServer;

  beforeAll(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;
    config.server.log.warnings = false;

    services = await servicesFactory(config);

    server = HttpServer.create(config, services);
    await server.initialize();

    testAuth = new TestAuthentication(services);
  });

  afterAll(async () => {
    await services.shutdown();
    await server.shutdown();
  });

  describe('GET /api/point-icons', () => {
    it('should fail for non connected user', async () => {
      // Act
      const res = await server.getApp().inject({
        url: '/api/point-icons',
        method: 'POST',
      });

      // Assert
      assert.equal(res.statusCode, 403);
    });

    it('should work for anonymous user', async () => {
      // Act
      const res = await server.getApp().inject({
        url: '/api/point-icons',
        method: 'POST',
        body: {
          names: [
            'iso7001/ISO-7001---Red-Cross.svg',
            'iso7001/ISO-7001---Red-Slash.svg',
            'iso7001/ISO-7001-PI-BP-001.svg',
            'iso7001/ISO-7001-PI-BP-002.svg',
            'iso7001/ISO-7001-PI-BP-003.svg',
          ],
        },
        headers: {
          ...testAuth.anonymous(),
        },
      });

      // Assert
      expect(res.statusCode).equal(200);

      const body: GetPointIconsResponse = JSON.parse(res.body);
      expect(body.icons.length).equal(5);

      expect(body.icons.sort((a, b) => a.name.localeCompare(b.name))).toMatchSnapshot();
    });
  });
});
