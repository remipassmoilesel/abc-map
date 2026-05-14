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

import { errorMessage } from '@abc-map/shared';
import { ConfigLoader, disableConfigLoaderLogger } from './ConfigLoader.js';
import { assert, describe, expect, it } from 'vitest';

disableConfigLoaderLogger();

describe('ConfigLoader', () => {
  it('load inexistant', async () => {
    const err = await ConfigLoader.load('/not/a/config').catch((err) => err);
    assert.match(err.message, /Cannot load configuration \/not\/a\/config/);
  });

  it('load bad config', async () => {
    const err = await ConfigLoader.load('resources/test/bad-config.js').catch((err) => err);
    expect(errorMessage(err)).toMatch(/Configuration .+ is not valid/gi);
  });

  it('load development.mjs', async () => {
    const config = await ConfigLoader.load(ConfigLoader.DEFAULT_CONFIG_PATH);
    // We must keep this URL in source code for local CI
    assert.equal(config.externalUrl, 'http://localhost:10082');
    assert.isDefined(config.environmentName);
    assert.isDefined(config.webappPath);
    assert.isDefined(config.userDocumentationPath);
  });

  it('load continuous-integration.mjs', async () => {
    const config = await ConfigLoader.load('resources/configuration/continuous-integration.mjs');
    assert.equal(config.externalUrl, 'http://localhost:10082');
    assert.isDefined(config.environmentName);
    assert.isDefined(config.webappPath);
    assert.isDefined(config.userDocumentationPath);
  });

  it('safeConfig() should hide secrets', async () => {
    // Use this to mark secret fields (passwords, ...)
    const SecretValue = 'SecretValue';

    const safeConfig = ConfigLoader.safeConfig({
      environmentName: 'test-env',
      externalUrl: 'http://localhost:10082/',
      server: {
        host: 'localhost',
        port: 10_082,
        log: {
          requests: false,
          errors: false,
          warnings: false,
        },
        globalRateLimit: {
          max: 1000,
          timeWindow: '1m',
        },
        authenticationRateLimit: {
          max: 1000,
          timeWindow: '1m',
        },
      },
      project: {
        maxPerUser: 10,
      },
      database: {
        url: 'mongodb://abc-mongodb-server:27017',
        username: 'mongo',
        password: SecretValue,
      },
      jwt: {
        algorithm: 'HS512',
      },
      authentication: {
        secret: SecretValue,
        tokenExpiresIn: '45min',
        passwordLostExpiresIn: '30min',
      },
      registration: {
        passwordSalt: SecretValue,
        secret: SecretValue,
        confirmationExpiresIn: '24h',
      },
      smtp: {
        from: 'no-reply@abc-map.fr',
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'lelia16@ethereal.email',
          pass: SecretValue,
        },
      },
      datastore: {
        path: 'resources/dev-datastore',
      },
      development: {
        generateData: {
          users: 100,
          projectsPerUser: 0,
        },
        persistEmails: true,
      },
      webapp: {
        appendToBody: '<div>Server templated content (webapp)</div>',
      },
      userDocumentation: {
        appendToBody: '<div>Server templated content (userDocumentation)</div>',
      },
      legalMentions: `Test legal mentions`,
      pointIconsPath: '/point/icons',
      userDocumentationPath: '/user/documentation',
      webappPath: '/webapp',
    });

    assert.equal(JSON.stringify(safeConfig).includes(SecretValue), false);
  });

  it('should reject bad ms values', async () => {
    const err = await ConfigLoader.load('resources/test/bad-config-2.js').catch((err) => err);
    expect(errorMessage(err)).toMatch(/Some time values are incorrect, you should use a/gi);
  });
});
