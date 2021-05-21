import { ObjectId } from 'bson';

export interface GridFsFile {
  _id: ObjectId;
  length: number;
  chunkSize: number;
  uploadDate: string;
  filename: string;
  md5: string;
}
