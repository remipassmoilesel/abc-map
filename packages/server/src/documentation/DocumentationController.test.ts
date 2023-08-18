/**
 * Copyright © 2023 Rémi Pace.
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
 *
 *
 *
 */

import { assert } from 'chai';
import { Config } from '../config/Config';
import { Services, servicesFactory } from '../services/services';
import { HttpServer } from '../server/HttpServer';
import { ConfigLoader } from '../config/ConfigLoader';

describe('DocumentationController', () => {
  let config: Config;
  let services: Services;
  let server: HttpServer;

  before(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;
    config.server.log.warnings = false;

    services = await servicesFactory(config);
  });

  beforeEach(async () => {
    services.metrics.clearMetrics();

    server = HttpServer.create(config, services);
    await server.initialize();
  });

  after(async () => {
    await services.shutdown();
    await server.shutdown();
  });

  it('/documentation should redirect', async () => {
    const req = await server.getApp().inject({
      method: 'GET',
      path: '/documentation',
    });

    assert.equal(req.statusCode, 301);
    assert.equal(req.headers['location'], '/documentation/');
  });

  it('/documentation/', async () => {
    const req = await server.getApp().inject({
      method: 'GET',
      path: '/documentation/',
    });

    assert.equal(req.statusCode, 200);

    const body = req.body.slice(0, 300).replace(/\s/gi, '');
    assert.equal(body.includes('<title>Abc-Map-Documentation-'), true);
  });

  it('/documentation/index.html', async () => {
    const req = await server.getApp().inject({
      method: 'GET',
      path: '/documentation/index.html',
    });

    assert.equal(req.statusCode, 200);

    const body = req.body.slice(0, 300).replace(/\s/gi, '');
    assert.equal(body.includes('<title>Abc-Map-Documentation-'), true);
  });

  it('/documentation/en/automated-test-target should redirect', async () => {
    const req = await server.getApp().inject({
      method: 'GET',
      path: '/documentation/en/automated-test-target',
    });

    assert.equal(req.statusCode, 301);
    assert.equal(req.headers['location'], '/documentation/en/automated-test-target/');
  });

  it('/documentation/en/automated-test-target/', async () => {
    const req = await server.getApp().inject({
      method: 'GET',
      path: '/documentation/en/automated-test-target/',
    });

    assert.equal(req.statusCode, 200);

    const body = req.body.slice(0, 300).replace(/\s/gi, '');
    assert.equal(body.includes('<title>Abc-Map-Documentation-'), true);
  });

  it('/documentation/unknown-route', async () => {
    const req = await server.getApp().inject({
      method: 'GET',
      path: '/documentation/unknown-route',
    });

    assert.equal(req.statusCode, 404);
  });
});
