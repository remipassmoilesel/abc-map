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

import { ConfigLoader } from './ConfigLoader';
import { assert } from 'chai';

// TODO: better test

describe('ConfigLoader', () => {
  it('load()', async () => {
    const config = await ConfigLoader.load();
    assert.isDefined(config.environmentName);
    assert.isDefined(config.development);

    assert.isDefined(config.server);
    assert.equal(config.server.host, '127.0.0.1');
    assert.equal(config.server.port, 10_082);

    assert.isDefined(config.database);
    assert.isTrue(config.database.url.startsWith('mongodb://'));
    assert.equal(config.database.username, 'admin');
    assert.equal(config.database.password, 'admin');

    assert.isDefined(config.authentication);
    assert.equal(config.authentication.passwordSalt, 'azerty1234');
    assert.equal(config.authentication.jwtSecret, 'azerty1234');
    assert.equal(config.authentication.jwtAlgorithm, 'HS512');
    assert.equal(config.authentication.jwtExpiresIn, '45min');
  });
});
