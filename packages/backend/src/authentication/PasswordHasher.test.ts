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

import { PasswordHasher } from './PasswordHasher';
import { assert } from 'chai';
import { Config } from '../config/Config';

describe('PasswordHasher', () => {
  it('hashPassword() should work', async () => {
    const config: Config = {
      authentication: {
        passwordSalt: 'ABCDFEG',
      },
    } as any;

    const hasher = new PasswordHasher(config);

    const hash = await hasher.hashPassword('azerty1234', 'user-test-id');
    assert.isAtLeast(hash.length, 50);
    assert.isTrue(await hasher.verifyPassword('azerty1234', 'user-test-id', hash));
  });
});
