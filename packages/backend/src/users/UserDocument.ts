import { MongodbDocument } from '../mongodb/MongodbDocument';

export interface UserDocument extends MongodbDocument {
  email: string;
  password: string;
  enabled: boolean;
}
