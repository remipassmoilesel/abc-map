import { CsvParser } from './CsvParser';
import { File1, File2, File3, File4 } from './test-data';
import { CsvParsingError } from './typings';

describe('CsvParser', () => {
  describe('parse()', () => {
    it('should work', async () => {
      const rows = await CsvParser.parse(File1);

      expect(rows).toEqual([
        { label: 'value1', altitude: 1234 },
        { label: 'value2', altitude: 5678 },
      ]);
    });

    it('should normalize', async () => {
      const rows = await CsvParser.parse(File2);

      expect(rows).toEqual([
        { label: 'value3', altitude: 11.88 },
        { label: 'value4', altitude: 11.89 },
        { label: 'value5', altitude: 'Hello, how are you ?' },
      ]);
    });

    it('should return empty array', async () => {
      const result = await CsvParser.parse(File3);

      expect(result).toEqual([]);
    });

    it('should fail', async () => {
      const error: CsvParsingError = await CsvParser.parse(File4).catch((err) => err);
      expect(error.message).toMatch('Invalid data');
      expect(error.row).toEqual(0);
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
        { label: 'value1', altitude: 1234 },
        { label: 'value2', altitude: 5678 },
      ]);
    });

    it('should fail', async () => {
      const error: Error = await CsvParser.unparse([], 'test.csv').catch((err) => err);

      expect(error.message).toEqual('Nothing to export');
    });
  });
});
