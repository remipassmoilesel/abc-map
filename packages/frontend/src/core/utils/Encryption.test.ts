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

import { Encryption } from './Encryption';

/**
 * Warning: changes on encryption will require a data migration
 */
describe('Encryption', () => {
  it('encrypt()', async () => {
    const result = await Encryption.encrypt('test', 'secret');
    expect(result).not.toEqual('test');
    expect(result).toMatch('encrypted:');
  });

  it('decrypt() with correct secret', async () => {
    const encrypted = await Encryption.encrypt('test', 'secret');
    const result = await Encryption.decrypt(encrypted, 'secret');
    expect(result).toEqual('test');
  });

  it('decrypt() with incorrect secret', async () => {
    expect.assertions(1);
    const encrypted = await Encryption.encrypt('test', 'secret');
    return Encryption.decrypt(encrypted, 'not-the-secret').catch((err) => {
      expect(err.message).toMatch('Invalid password');
    });
  });
});
