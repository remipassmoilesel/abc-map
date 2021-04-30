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
import uuid from 'uuid-random';
import { nanoid } from 'nanoid';

export class TestDataSource implements DataSource {
  public static from(rows: Partial<DataRow>[]): TestDataSource {
    const _rows: DataRow[] = rows.map((r) => {
      if (typeof r._id !== 'undefined') {
        return r;
      } else {
        return { ...r, _id: nanoid(10) };
      }
    }) as DataRow[];
    return new TestDataSource(uuid(), _rows, 'TestDataSource' as DataSourceType);
  }

  constructor(private id: string, private rows: DataRow[], private type: DataSourceType) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return 'TestDataSource';
  }

  public getRows(): Promise<DataRow[]> {
    return Promise.resolve(this.rows);
  }

  public getType(): DataSourceType {
    return this.type;
  }
}
