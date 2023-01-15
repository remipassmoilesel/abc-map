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

import { Config } from '../config/Config';
import { Services, servicesFactory } from '../services/services';
import { HttpServer } from '../server/HttpServer';
import { ConfigLoader } from '../config/ConfigLoader';
import { assert } from 'chai';

describe('MetricsController', () => {
  let config: Config;
  let services: Services;
  let server: HttpServer;

  before(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;
    config.server.log.warnings = false;

    services = await servicesFactory(config);
    server = HttpServer.create(config, services);
    await server.initialize();
  });

  after(async () => {
    await services.shutdown();
    await server.shutdown();
  });

  describe('GET /api/metrics', async () => {
    it('should return metrics', async () => {
      // Act
      const response = await server.getApp().inject({
        method: 'GET',
        path: '/api/metrics',
      });

      // Assert
      assert.equal(response.statusCode, 200);
      assert.match(response.body, /# HELP nodejs_heap_space_size_available_bytes/);
    });
  });
});
