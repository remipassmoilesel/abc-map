import { MongodbDocument } from '../mongodb/MongodbDocument';
import { AbcProjection } from '@abc-map/shared-entities';

export interface ProjectDocument extends MongodbDocument {
  version: string;
  name: string;
  projection: AbcProjection;
  userId: string;
}
