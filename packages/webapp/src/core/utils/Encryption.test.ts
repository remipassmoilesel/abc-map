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
import { Errors } from './Errors';

/**
 * Warning: changes on encryption will require a data migration
 */
describe('Encryption', () => {
  it('encrypt()', async () => {
    const result = await Encryption.encrypt('text to encrypt', 'secret');
    expect(result).not.toEqual('test');
    expect(result).toMatch('encrypted:');
  });

  describe('decrypt()', () => {
    /**
     * If this test fail, you must migrate projects
     */
    it('with correct secret', async () => {
      // prettier-ignore
      // eslint-disable-next-line max-len
      const encrypted = 'encrypted:IntcIml2XCI6XCJsZm5XeTVoeUlSU1BuRWh4WWlOazZnPT1cIixcInZcIjoxLFwiaXRlclwiOjEwMDAwLFwia3NcIjoxMjgsXCJ0c1wiOjY0LFwibW9kZVwiOlwiY2NtXCIsXCJhZGF0YVwiOlwiXCIsXCJjaXBoZXJcIjpcImFlc1wiLFwic2FsdFwiOlwiZ25mM2RZbmxBVEE9XCIsXCJjdFwiOlwic09McnlaYjJ0dFNKV0dnenhKOTdiamFtdHZNWnVjND1cIn0i';
      const result = await Encryption.decrypt(encrypted, 'secret');
      expect(result).toEqual('text to decrypt');
    });

    it('with incorrect secret', async () => {
      const encrypted = await Encryption.encrypt('test', 'secret');
      const error: Error = await Encryption.decrypt(encrypted, 'not-the-secret').catch((err) => err);
      expect(Errors.isWrongPassword(error)).toBe(true);
    });
  });
});
