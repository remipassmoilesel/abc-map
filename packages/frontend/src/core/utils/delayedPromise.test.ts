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

import { resolveInAtLeast } from './resolveInAtLeast';

describe('solvesInAtLeast()', () => {
  it('should resolve now', async () => {
    const result = await resolveInAtLeast(Promise.resolve('value'), 0);

    expect(result).toEqual('value');
  });

  it('should resolve later', async () => {
    const start = Date.now();

    const result = await resolveInAtLeast(Promise.resolve('value 2'), 500);

    const took = Date.now() - start;
    expect(result).toEqual('value 2');
    expect(took).toBeGreaterThan(400); // Margins to prevent flickering test
  });

  it('should reject now', async () => {
    const result: Error = await resolveInAtLeast(Promise.reject(new Error('Test')), 500).catch((err) => err);

    expect(result).toEqual(new Error('Test'));
  });
});
