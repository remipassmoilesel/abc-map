import { MongodbDocument } from '../mongodb/MongodbDocument';
import { AbcProjection } from '@abc-map/shared-entities';

export interface ProjectDocument extends MongodbDocument {
  userId: string;
  version: string;
  name: string;
  projection: AbcProjection;
  containsCredentials: boolean;
}
