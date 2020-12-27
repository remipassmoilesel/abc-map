import { MongodbDocument } from '../mongodb/MongodbDocument';

export interface ArtefactDocument extends MongodbDocument {
  name: string;
  path: string;
  description?: string;
  files: string[];
  keywords: string[];
  license: string;
  links: string[];
}
