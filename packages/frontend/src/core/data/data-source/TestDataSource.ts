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
