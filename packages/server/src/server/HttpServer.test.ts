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
import { HttpServer } from './HttpServer';
import { ConfigLoader } from '../config/ConfigLoader';
import { assert } from 'chai';

describe('HttpServer', () => {
  let config: Config;
  let services: Services;
  let server: HttpServer;

  before(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;
    config.server.log.warnings = false;

    config.server.globalRateLimit.max = 2;
    config.server.globalRateLimit.timeWindow = '1min';

    const bottomScript = '<script>console.log("Bottom script")</script>';
    config.webapp = { appendToBody: bottomScript };

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

  it('should serve index in english by default', async () => {
    const res = await server.getApp().inject({
      method: 'GET',
      path: '/',
    });

    assert.equal(res.statusCode, 200);
    assert.match(res.body, /Abc-Map - Free \(as in freedom\) online mapping/);
  });

  it('should serve index in french if header set', async () => {
    const res = await server.getApp().inject({
      method: 'GET',
      path: '/',
      headers: { 'accept-language': 'fr-FR,fr;q=0.9,en-EN;q=0.8,fr;q=0.7' },
    });

    assert.equal(res.statusCode, 200);
    assert.match(res.body, /Abc-Map - Cartographie libre et gratuite en ligne/);
  });

  it('should template "appendToBody" variable', async () => {
    const res = await server.getApp().inject({ method: 'GET', path: '/' });

    assert.equal(res.statusCode, 200);
    assert.include(res.body, '<script>console.log("Bottom script")</script>');
  });

  it('should reply 200 on head request', async () => {
    const res = await server.getApp().inject({
      method: 'HEAD',
      path: '/',
    });

    assert.equal(res.statusCode, 200);
  });

  it('should return security headers on /', async () => {
    const res = await server.getApp().inject({
      method: 'GET',
      path: '/',
    });

    assert.isDefined(res.headers['x-dns-prefetch-control']);
    assert.isDefined(res.headers['strict-transport-security']);
    assert.isDefined(res.headers['x-download-options']);
    assert.isDefined(res.headers['x-content-type-options']);
    assert.isDefined(res.headers['x-permitted-cross-domain-policies']);
    assert.isDefined(res.headers['referrer-policy']);

    // We must allow iframes for shared maps
    assert.equal(res.headers['x-frame-options'], undefined);
  });

  it('should serve sitemap.xml', async () => {
    const req = await server.getApp().inject({
      method: 'GET',
      path: '/sitemap.xml',
    });

    assert.equal(req.headers['content-type'], 'text/xml; charset=utf-8');
    assert.isTrue(req.body.replace(/\s/gi, '').startsWith('<?xmlversion="1.0"encoding="UTF-8"?>'));
  });

  it('should serve legal mentions', async () => {
    const req = await server.getApp().inject({
      method: 'GET',
      path: '/legal-mentions.html',
    });

    assert.equal(req.headers['content-type'], 'text/html; charset=utf-8');
    assert.isTrue(req.body.replace(/\s/gi, '').includes('<title>Legalmentions</title>'));
  });

  it('should serve documentation', async () => {
    const req = await server.getApp().inject({
      method: 'GET',
      path: '/documentation/',
    });

    const body = req.body.slice(0, 300).replace(/\s/gi, '');
    assert.equal(body.includes('<title>Abc-Map-Documentation-'), true);
  });

  describe('Rate limiting', () => {
    async function testRateLimit(route: string, okStatus: number) {
      // We do a lot of requests on route with client 1
      for (let i = 0; i <= config.server.globalRateLimit.max * 1.2; i++) {
        await server.getApp().inject({
          method: 'GET',
          path: route,
          headers: {
            'x-forwarded-for': '10.10.10.10',
          },
        });
      }

      // We do one more request with client 1
      const blocked = await server.getApp().inject({
        method: 'GET',
        path: route,
        headers: {
          'x-forwarded-for': '10.10.10.10',
        },
      });

      // We do one control request with client 2
      const notBlocked = await server.getApp().inject({
        method: 'GET',
        path: route,
        headers: {
          'x-forwarded-for': '10.10.10.20',
        },
      });

      assert.equal(blocked.statusCode, 429, `Invalid status code for route ${route}`);
      assert.match(blocked.body, /Too Many Requests/, `Invalid body for route ${route}`);
      assert.equal(notBlocked.statusCode, okStatus, `Invalid status code for route ${route}`);
    }

    [
      { label: 'should work on API', route: '/api/metrics' },
      //
      { label: 'should work for special routes', route: '/' },
      { label: 'should work for index', route: '/index.html' },
      { label: 'should work for sitemap', route: '/sitemap.xml' },
      { label: 'should work for legal mentions', route: '/legal-mentions.html' },
      { label: 'should work for unknown route', route: '/unknown/route', okStatus: 404 },
      { label: 'should work for unknown webapp route', route: '/en/unknown/webapp/route', okStatus: 404 },
      //
      { label: 'should work for static files', route: '/manifest.json' },
    ].forEach(({ label, route, okStatus }) => {
      it(label, async () => {
        await testRateLimit(route, okStatus || 200);
      });
    });
  });
});
