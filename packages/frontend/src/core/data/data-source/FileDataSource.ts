import { DataRow, DataSource, DataSourceType } from './DataSource';
import { Logger } from '@abc-map/frontend-shared';
import { CsvParser } from '../csv-parser/CsvParser';
import { nanoid } from 'nanoid';

export const logger = Logger.get('FileDataSource');

export class FileDataSource implements DataSource {
  private _cache?: DataRow[];
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
    this._cache = rows.map((r) => ({ ...r, _id: nanoid(10) }));
    return this._cache;
  }
}
