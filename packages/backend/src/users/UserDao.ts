import { Config } from '../config/Config';
import { MongodbClient } from '../mongodb/MongodbClient';
import { UserDocument } from './UserDocument';
import { MongodbCollection } from '../mongodb/MongodbCollection';

export class UserDao {
  constructor(private config: Config, private client: MongodbClient) {}

  public async init(): Promise<void> {
    const coll = await this.client.collection<UserDocument>(MongodbCollection.Users);
    await coll.createIndex('email', { unique: true });
  }

  public async save(project: UserDocument): Promise<void> {
    const coll = await this.client.collection<UserDocument>(MongodbCollection.Users);
    await coll.replaceOne({ _id: project._id }, project, { upsert: true });
  }

  public async findById(id: string): Promise<UserDocument | undefined> {
    const coll = await this.client.collection<UserDocument>(MongodbCollection.Users);
    const res = await coll.findOne({ _id: id });
    return res || undefined;
  }

  public async findByEmail(email: string): Promise<UserDocument | undefined> {
    const coll = await this.client.collection<UserDocument>(MongodbCollection.Users);
    const res = await coll.findOne({ email });
    return res || undefined;
  }
}
