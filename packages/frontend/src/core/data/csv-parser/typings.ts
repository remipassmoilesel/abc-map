export declare type CsvRow = { [k: string]: string | number | undefined };

export class CsvParsingError extends Error {
  constructor(message: string, public row?: number) {
    super(message);
  }
}
