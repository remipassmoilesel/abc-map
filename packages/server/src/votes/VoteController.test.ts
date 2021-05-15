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
import { AbcVote, VoteValue } from '@abc-map/shared-entities';
import { TestAuthentication } from '../utils/TestAuthentication';

describe('VoteController', () => {
  let config: Config;
  let services: Services;
  let server: HttpServer;
  let testAuth: TestAuthentication;

  before(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;

    services = await servicesFactory(config);
    server = HttpServer.create(config, services);
    await server.initialize();

    testAuth = new TestAuthentication(services);
  });

  after(async () => {
    await services.shutdown();
    await server.shutdown();
  });

  describe('POST /api/vote/', () => {
    it('should fail for non connected user', async () => {
      const vote: AbcVote = { value: VoteValue.SATISFIED };
      const res = await server.getApp().inject({
        url: '/api/vote',
        method: 'POST',
        payload: vote,
      });

      assert.equal(res.statusCode, 403);
    });

    it('should work', async () => {
      const vote: AbcVote = { value: VoteValue.SATISFIED };
      const res = await server.getApp().inject({
        url: '/api/vote',
        method: 'POST',
        payload: vote,
        headers: testAuth.anonymous(),
      });

      assert.equal(res.statusCode, 200);
    });

    it('should work', async () => {
      const vote: AbcVote = { value: VoteValue.SATISFIED };
      const res = await server.getApp().inject({
        url: '/api/vote',
        method: 'POST',
        payload: vote,
        headers: testAuth.anonymous(),
      });

      assert.equal(res.statusCode, 200);
    });

    it('too many vote should fail', async () => {
      const vote: AbcVote = { value: VoteValue.SATISFIED };

      for (let i = 0; i < 10; i++) {
        await server.getApp().inject({
          url: '/api/vote',
          method: 'POST',
          payload: vote,
          headers: testAuth.anonymous(),
        });
      }

      const res = await server.getApp().inject({
        url: '/api/vote',
        method: 'POST',
        payload: vote,
        headers: testAuth.anonymous(),
      });

      assert.equal(res.statusCode, 429);
    });
  });

  describe('GET /api/vote/statistics/:from/:to', () => {
    it('should fail for non connected user', async () => {
      const from = new Date().toISOString();
      const to = new Date().toISOString();
      const res = await server.getApp().inject({
        url: `/api/vote/statistics/${from}/${to}`,
        method: 'GET',
      });

      assert.equal(res.statusCode, 403);
    });

    it('should work for connected user', async () => {
      const from = new Date().toISOString();
      const to = new Date().toISOString();
      const res = await server.getApp().inject({
        url: `/api/vote/statistics/${from}/${to}`,
        method: 'GET',
        headers: testAuth.anonymous(),
      });

      assert.equal(res.statusCode, 200);
    });
  });
});
