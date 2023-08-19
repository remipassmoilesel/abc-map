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
 */

import { getAllFieldNames, getFieldNames, trySelectMainFieldName } from './getFieldNames';

describe('getFieldNames', () => {
  it('getFieldNames', () => {
    const expected = getFieldNames({
      id: 'test-id',
      metadata: {
        selected: false,
      },
      data: {
        'field-1': 'value-1',
        'field-2': 'value-1',
      },
    });

    expect(expected).toEqual(['field-1', 'field-2']);
  });

  it('getAllFieldNames', () => {
    const expected = getAllFieldNames([
      {
        id: 'test-id',
        metadata: {
          selected: false,
        },
        data: {
          'field-1': 'value-1',
          'field-2': 'value-2',
        },
      },
      {
        id: 'test-id',
        metadata: {
          selected: false,
        },
        data: {
          'field-1': 'value-1',
          'field-2': 'value-2',
          'field-3': 'value-3',
        },
      },
    ]);

    expect(expected).toEqual(['field-1', 'field-2', 'field-3']);
  });

  describe('trySelectMainFieldName()', () => {
    it('exact match', () => {
      const candidates = ['pop2023', 'CODE', 'NAME'];
      expect(trySelectMainFieldName(candidates)).toEqual('NAME');
    });

    it('partial match', () => {
      const candidates = ['pop2023', 'CODE_REGION', 'FULL_NAME'];
      expect(trySelectMainFieldName(candidates)).toEqual('FULL_NAME');
    });

    it('first match', () => {
      const candidates = ['XXXXX', 'ZZZZZ', 'DDDDDD'];
      expect(trySelectMainFieldName(candidates)).toEqual('XXXXX');
    });
  });
});
