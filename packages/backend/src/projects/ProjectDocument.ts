import { MongodbDocument } from '../mongodb/MongodbDocument';
import { AbcLayer, AbcLayout, AbcProjectMetadata } from '@abc-map/shared-entities';

export interface ProjectDocument extends MongodbDocument {
  metadata: AbcProjectMetadata;
  layers: AbcLayer[];
  layouts: AbcLayout[];
}
