export interface AbcFile<T extends Blob | Buffer = Blob | Buffer> {
  path: string;
  content: T;
}
