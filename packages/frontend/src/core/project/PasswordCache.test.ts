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

import { PasswordCache } from './PasswordCache';
import { TestHelper } from '../utils/test/TestHelper';

describe('PasswordCache', function () {
  let cache: PasswordCache;
  beforeEach(() => {
    cache = new PasswordCache(10);
  });

  it('set() then get()', function () {
    cache.set('azerty1234');
    expect(cache.get()).toEqual('azerty1234');
  });

  it('when set(), value should be reset after XXms', async () => {
    // Act
    cache.set('azerty1234');
    await TestHelper.wait(20);

    // Assert
    expect(cache.get()).toEqual(undefined);
  });
});
