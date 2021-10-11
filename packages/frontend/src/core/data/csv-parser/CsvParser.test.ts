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

import { CsvParser } from './CsvParser';
import { File1, File2, File3, File4 } from './CsvParser.test.data';
import { CsvParsingError } from './typings';

describe('CsvParser', () => {
  describe('parse()', () => {
    it('should work', async () => {
      const rows = await CsvParser.parse(File1);

      expect(rows).toEqual([
        { label: 'value1', altitude: '1234' },
        { label: 'value2', altitude: '5678' },
      ]);
    });

    it('should return empty array', async () => {
      const result = await CsvParser.parse(File2);

      expect(result).toEqual([]);
    });

    it('should fail', async () => {
      const error: CsvParsingError = await CsvParser.parse(File3).catch((err) => err);

      expect(error).toBeInstanceOf(CsvParsingError);
      expect(error.message).toMatch('Invalid data');
      expect(error.row).toEqual(1);
    });

    it('should fail and return line of error', async () => {
      const error: CsvParsingError = await CsvParser.parse(File4).catch((err) => err);

      expect(error).toBeInstanceOf(CsvParsingError);
      expect(error.message).toMatch('Invalid data');
      expect(error.row).toEqual(4);
    });
  });

  describe('unparse()', () => {
    it('should work', async () => {
      let rows = await CsvParser.parse(File1);
      const file = await CsvParser.unparse(rows, 'test.csv');

      expect(file.name).toEqual('test.csv');
      expect(file.size).toEqual(40);

      rows = await CsvParser.parse(file);
      expect(rows).toEqual([
        { label: 'value1', altitude: '1234' },
        { label: 'value2', altitude: '5678' },
      ]);
    });

    it('should fail', async () => {
      const error: Error = await CsvParser.unparse([], 'test.csv').catch((err) => err);

      expect(error.message).toEqual('Nothing to export');
    });
  });
});
