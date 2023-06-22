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

import { DataRow, DataSource, DataSourceType } from './DataSource';
import { Logger } from '@abc-map/shared';
import { CsvParser } from '../csv-parser/CsvParser';
import { nanoid } from 'nanoid';

export const logger = Logger.get('CsvDataSource');

export class CsvDataSource implements DataSource {
  private _cache: DataRow[] | undefined;

  constructor(private file: File) {}

  public getId(): string {
    return `${this.file.name}-${this.file.lastModified}-${this.file.size}`;
  }

  public getName(): string {
    return this.file.name;
  }

  public getType(): DataSourceType {
    return DataSourceType.CsvFile;
  }

  public async getRows(): Promise<DataRow[]> {
    if (this._cache) {
      return this._cache;
    }

    const rows = await CsvParser.parse(this.file);
    this._cache = rows.map<DataRow>((row) => ({
      id: nanoid(10),
      metadata: { selected: false },
      data: row,
    }));

    return this._cache;
  }
}
