import { MongodbDocument } from '../mongodb/MongodbDocument';

export interface VoteDocument extends MongodbDocument {
  value: number;
  date: Date;
}
