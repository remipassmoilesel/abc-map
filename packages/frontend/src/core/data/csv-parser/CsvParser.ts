import * as Papa from 'papaparse';
import { BlobIO, Logger } from '@abc-map/frontend-commons';
import { CsvParsingError, CsvRow } from './typings';
import { asNumberOrString } from '../../utils/numbers';

const logger = Logger.get('CsvParser.ts');

export class CsvParser {
  public static async parse(file: File): Promise<CsvRow[]> {
    const content = await BlobIO.asString(file);

    // We must trim content before passing, otherwise parsing will fail
    const results = Papa.parse<CsvRow>(content.trim(), {
      header: true,
      delimiter: ',',
      quoteChar: '"',
      encoding: 'utf-8',
      skipEmptyLines: true,
    });

    if (results.errors.length) {
      return Promise.reject(new CsvParsingError(`Invalid data: ${results.errors[0].message}`, results.errors[0].row));
    }

    const data = results.data;
    if (!data.length) {
      return data;
    }

    const firstIsNotObject = data[0].constructor.name !== 'Object';
    if (firstIsNotObject) {
      return Promise.reject(new Error(`Invalid file, it must contains headers`));
    }

    return this.normalize(data);
  }

  /**
   * All values parsed from papaparse are string. In order to prevent errors with Javascript type coercion,
   * we cast numbers as numbers for better processing.
   *
   * @param rows
   * @private
   */
  private static normalize(rows: CsvRow[]): CsvRow[] {
    for (const row of rows) {
      for (const property in row) {
        const value = row[property] as string;
        row[property] = asNumberOrString(value);
      }
    }
    return rows;
  }

  public static async unparse(rows: CsvRow[], name: string): Promise<File> {
    if (!rows.length) {
      return Promise.reject(new Error('Nothing to export'));
    }

    const content = Papa.unparse(rows, {
      header: true,
      delimiter: ',',
      quoteChar: '"',
    });
    return new File([content], name, { type: 'text/csv' });
  }
}
