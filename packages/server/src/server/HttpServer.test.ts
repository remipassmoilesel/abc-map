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
import { hashSource, HttpServer, isItWorthLogging } from './HttpServer';
import { ConfigLoader } from '../config/ConfigLoader';
import { assert } from 'chai';
import { FrontendRoutes, Language } from '@abc-map/shared';
import { FastifyRequest } from 'fastify';

describe('HttpServer', () => {
  let config: Config;
  let services: Services;
  let server: HttpServer;

  before(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;
    config.server.globalRateLimit.max = 2;
    config.server.globalRateLimit.timeWindow = '1min';

    const bottomScript = '<script>console.log("Bottom script")</script>';
    config.frontend = { appendToBody: bottomScript };

    services = await servicesFactory(config);
  });

  beforeEach(async () => {
    services.metrics.getRegistry().clear();

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
    assert.isDefined(res.headers['x-frame-options']);
    assert.isDefined(res.headers['strict-transport-security']);
    assert.isDefined(res.headers['x-download-options']);
    assert.isDefined(res.headers['x-content-type-options']);
    assert.isDefined(res.headers['x-permitted-cross-domain-policies']);
    assert.isDefined(res.headers['referrer-policy']);
  });

  it('should allow iframe on shared maps', async () => {
    const res = await server.getApp().inject({
      method: 'GET',
      path: new FrontendRoutes(Language.French).sharedMap().withParams({ projectId: 'test-project-id' }),
    });

    assert.isUndefined(res.headers['x-frame-options']);

    assert.isDefined(res.headers['x-dns-prefetch-control']);
    assert.isDefined(res.headers['strict-transport-security']);
    assert.isDefined(res.headers['x-download-options']);
    assert.isDefined(res.headers['x-content-type-options']);
    assert.isDefined(res.headers['x-permitted-cross-domain-policies']);
    assert.isDefined(res.headers['referrer-policy']);
  });

  it('should apply rate limit', async () => {
    for (let i = 0; i <= config.server.globalRateLimit.max; i++) {
      await server.getApp().inject({
        method: 'GET',
        path: '/',
        headers: {
          'x-forwarded-for': '10.10.10.10',
        },
      });
    }
    const blocked = await server.getApp().inject({
      method: 'GET',
      path: '/',
      headers: {
        'x-forwarded-for': '10.10.10.10',
      },
    });
    const notBlocked = await server.getApp().inject({
      method: 'GET',
      path: '/',
      headers: {
        'x-forwarded-for': '10.10.10.20',
      },
    });

    assert.equal(blocked.statusCode, 429);
    assert.match(blocked.body, /Quota of requests exceeded/);
    assert.equal(notBlocked.statusCode, 200);
  });

  it('should serve sitemap.xml', async () => {
    const req = await server.getApp().inject({
      method: 'GET',
      path: '/sitemap.xml',
    });

    assert.equal(req.headers['content-type'], 'text/xml; charset=utf-8');
    assert.isTrue(req.body.replace(/\s/gi, '').startsWith('<?xmlversion="1.0"encoding="UTF-8"?>'));
  });

  it('hashSource()', () => {
    const req1 = fakeRequest();
    assert.deepEqual(hashSource(req1), '5fe14f265f1aab15f4474efeb0b9bffeac3793a7c6905f8344f638653231bc2a');

    const req2 = fakeRequest({ headers: { 'x-forwarded-for': '90.90.90.90' } });
    assert.deepEqual(hashSource(req2), 'ff05e2ffcb03cfea04d594778ef2e19ca6657f7d5856f9ee7d947ddf835bce5e');

    const req3 = fakeRequest({ headers: { 'x-forwarded-for': '90.90.90.90', 'user-agent': 'Mozilla/5.0 Firefox/5.0.1' } });
    assert.deepEqual(hashSource(req3), '450f862a2f253aee6ff4679dcea399eb3ad1566033cc0bd42d491e29ae613b2f');
  });

  it('isItWorthLogging()', () => {
    assert.isTrue(isItWorthLogging(fakeRequest()));
    assert.isTrue(isItWorthLogging(fakeRequest({ url: '/', headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })));
    assert.isTrue(isItWorthLogging(fakeRequest({ url: '/api/authentication', headers: { 'user-agent': 'Go-http-client/1.0' } })));

    assert.isFalse(isItWorthLogging(fakeRequest({ url: '/', headers: { 'user-agent': 'Go-http-client/1.0' } })));
    assert.isFalse(isItWorthLogging(fakeRequest({ url: '/api/health', headers: { 'user-agent': 'kube-probe/1.0' } })));
  });
});

function fakeRequest(source?: Partial<FastifyRequest>): FastifyRequest {
  return { ...source, headers: { ...source?.headers } } as unknown as FastifyRequest;
}
