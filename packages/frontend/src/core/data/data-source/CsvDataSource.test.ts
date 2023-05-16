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

import { DataSourceType } from './DataSource';
import { CsvDataSource, logger } from './CsvDataSource';
import { File1 } from './CsvDataSource.test.data';

logger.disable();

describe('CsvDataSource', () => {
  it('getId()', () => {
    const data = new CsvDataSource(File1);

    expect(data.getId()).toMatch(/^test\.csv/);
  });

  it('getType()', () => {
    const data = new CsvDataSource(File1);

    expect(data.getType()).toEqual(DataSourceType.CsvFile);
  });

  it('getRows()', async () => {
    const data = new CsvDataSource(File1);

    const rows = await data.getRows();

    expect(rows).toHaveLength(2);
    rows.forEach((r) => expect(r.id).toBeDefined());

    const comparable = rows.map((r) => ({ ...r, id: '' }));
    expect(comparable).toEqual([
      { id: '', data: { label: 'value1', altitude: '1234' } },
      { id: '', data: { label: 'value2', altitude: '5678' } },
    ]);
  });

  it('getRows() from cache', async () => {
    const data = new CsvDataSource(File1);

    const firsts = await data.getRows();
    const seconds = await data.getRows();

    expect(firsts).toHaveLength(2);
    expect(seconds).toEqual(firsts);
  });
});
