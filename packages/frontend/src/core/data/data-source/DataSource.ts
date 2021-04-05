export interface DataSource {
  getId(): string;
  getName(): string;
  getRows(): Promise<DataRow[]>;
  getType(): DataSourceType;
}

export enum DataSourceType {
  VectorLayer = 'VectorLayer',
  CsvFile = 'CsvFile',
}

export declare type DataRow = {
  /**
   * ID is the unique identifier of row. It should not be visible in UI.
   */
  _id: string | number;
  [k: string]: DataValue | undefined;
};

export declare type DataValue = string | number;

export function getFields(row: DataRow): string[] {
  return Object.keys(row).filter((f) => f !== '_id');
}
