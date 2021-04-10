import { MongodbDocument } from '../mongodb/MongodbDocument';

export interface ArtefactDocument extends MongodbDocument {
  name: string;
  description?: string;
  keywords: string[];
  license: string;
  link?: string;
  path: string;
  files: string[];
}
