import { Config } from '../config/Config';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ProjectDocument } from './ProjectDocument';
import { MongoCollection } from '../mongodb/MongoCollection';

export class ProjectDao {
  constructor(private config: Config, private client: MongodbClient) {}

  public async save(project: ProjectDocument): Promise<void> {
    const coll = await this.client.collection<ProjectDocument>(MongoCollection.Projects);
    await coll.replaceOne({ _id: project._id }, project, { upsert: true });
  }

  public async findById(id: string): Promise<ProjectDocument | undefined> {
    const coll = await this.client.collection<ProjectDocument>(MongoCollection.Projects);
    const res = await coll.findOne({ _id: id });
    return res || undefined;
  }

  public async list(offset: number, limit: number): Promise<ProjectDocument[]> {
    const coll = await this.client.collection<ProjectDocument>(MongoCollection.Projects);
    return await coll.find({}).skip(offset).limit(limit).toArray();
  }
}
