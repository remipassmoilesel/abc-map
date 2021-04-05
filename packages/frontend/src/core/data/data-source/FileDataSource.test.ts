import { DataSourceType } from './DataSource';
import { FileDataSource, logger } from './FileDataSource';
import { File1 } from '../csv-parser/test-data';

logger.disable();

describe('FileDataSource', () => {
  it('getId()', () => {
    const data = new FileDataSource(File1);

    expect(data.getId()).toMatch(/^test\.csv/);
  });

  it('getType()', () => {
    const data = new FileDataSource(File1);

    expect(data.getType()).toEqual(DataSourceType.CsvFile);
  });

  it('getRows()', async () => {
    const data = new FileDataSource(File1);

    const rows = await data.getRows();

    expect(rows).toHaveLength(2);
    rows.forEach((r) => expect(r._id).toBeDefined());
    const comparable = rows.map((r) => ({ ...r, _id: '' }));
    expect(comparable).toEqual([
      { _id: '', label: 'value1', altitude: 1234 },
      { _id: '', label: 'value2', altitude: 5678 },
    ]);
  });

  it('getRows() from cache', async () => {
    const data = new FileDataSource(File1);

    const firsts = await data.getRows();
    const seconds = await data.getRows();

    expect(firsts).toHaveLength(2);
    expect(seconds).toEqual(firsts);
  });
});
