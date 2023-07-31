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

import { XMLParser } from 'fast-xml-parser';
import * as _ from 'lodash';
import { assert, expect } from 'chai';
import { Config } from '../../config/Config';
import { Services, servicesFactory } from '../../services/services';
import { HttpServer } from '../HttpServer';
import { ConfigLoader } from '../../config/ConfigLoader';

describe('SitemapController', () => {
  let config: Config;
  let services: Services;
  let server: HttpServer;

  before(async () => {
    config = await ConfigLoader.load();
    config.server.log.requests = false;
    config.server.log.errors = false;
    config.server.log.warnings = false;

    config.server.globalRateLimit.max = 10000;
    config.server.globalRateLimit.timeWindow = '1min';

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

  it('Sitemap.xml URLs should all have status 200', async () => {
    // Prepare
    const req = await server.getApp().inject({
      method: 'GET',
      path: '/sitemap.xml',
    });

    const parser = new XMLParser({ ignoreAttributes: false });
    const sitemap = parser.parse(req.body);
    const urls = _.uniq(listUrls(sitemap));
    expect(urls.length).at.least(30);

    // Act
    const results: { url: string; status: number; error?: Error }[] = [];
    for (const url of urls) {
      await server
        .getApp()
        .inject({
          method: 'GET',
          path: url,
        })
        .then((response) => {
          results.push({ url, status: response.statusCode });
        })
        .catch((err) => {
          results.push({ url, status: -1, error: err });
        });
    }

    // Assert
    const errors = results.filter((res) => !!res.error);
    assert.lengthOf(errors, 0, 'Errors: ' + JSON.stringify(errors, null, 2));

    const badStatuses = results.filter((res) => res.status !== 200);
    assert.lengthOf(badStatuses, 0, 'Bad status codes: ' + JSON.stringify(badStatuses, null, 2));
  });
});

function listUrls(input: any): string[] {
  let result: string[] = [];

  if (!input) {
    return result;
  }

  if (Array.isArray(input)) {
    for (const item of input) {
      result = result.concat(listUrls(item));
    }
  }

  if (typeof input === 'object') {
    for (const [key, value] of Object.entries(input)) {
      if (key === 'loc' && typeof value === 'string') {
        result.push(value);
      } else if (key === '@_href' && typeof value === 'string') {
        result.push(value);
      } else {
        result = result.concat(listUrls(value));
      }
    }
  }

  return result;
}
