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

import { ConfigLoader, logger } from './ConfigLoader';
import { assert } from 'chai';

logger.disable();

describe('ConfigLoader', () => {
  let loader: ConfigLoader;
  beforeEach(() => {
    loader = new ConfigLoader();
  });

  it('load inexistant', async () => {
    const err = await loader.load('/not/a/config').catch((err) => err);
    assert.match(err.message, /Cannot load configuration \/not\/a\/config/);
  });

  it('load bad config', async () => {
    const err = await loader.load('resources/test/wrong-config.js').catch((err) => err);
    assert.match(err.message, /Invalid configuration resources\/test\/wrong-config.js: {"instancePath"/);
  });

  it('load development.js', async () => {
    const config = await loader.load(ConfigLoader.DEFAULT_CONFIG);
    // We must keep this URL in source code for local CI
    assert.equal(config.externalUrl, 'http://localhost:10082');
    assert.isDefined(config.environmentName);
    assert.isDefined(config.webappPath);
    assert.isDefined(config.userDocumentationPath);
  });

  it('load continuous-integration.js', async () => {
    const config = await loader.load('resources/configuration/continuous-integration.js');
    assert.equal(config.externalUrl, 'http://localhost:10082');
    assert.isDefined(config.environmentName);
    assert.isDefined(config.webappPath);
    assert.isDefined(config.userDocumentationPath);
  });
});
