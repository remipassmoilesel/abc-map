import { Config } from '../config/Config';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ProjectDocument } from './ProjectDocument';
import { MongodbCollection } from '../mongodb/MongodbCollection';
import { MongodbBucket } from '../mongodb/MongodbBucket';
import { Readable } from 'stream';
import { StreamReader } from '../utils/StreamReader';

export class ProjectDao {
  constructor(private config: Config, private client: MongodbClient) {}

  public async saveMetadata(project: ProjectDocument): Promise<void> {
    const coll = await this.client.collection<ProjectDocument>(MongodbCollection.Projects);
    await coll.replaceOne({ _id: project._id }, project, { upsert: true });
  }

  public async saveCompressedFile(projectId: string, file: Buffer): Promise<void> {
    const bucket = await this.client.bucket(MongodbBucket.Projects);
    const upload = bucket.openUploadStream(projectId);
    const fileStream = Readable.from(file);

    const res: Promise<void> = new Promise((resolve, reject) => {
      upload.on('finish', () => resolve());
      upload.on('error', (err) => reject(err));
    });

    fileStream.pipe(upload);
    return res;
  }

  public async findMetadataById(projectId: string): Promise<ProjectDocument | undefined> {
    const coll = await this.client.collection<ProjectDocument>(MongodbCollection.Projects);
    const res = await coll.findOne({ _id: projectId });
    return res || undefined;
  }

  // TODO: we should stream file to client
  public async findCompressedFileById(projectId: string): Promise<Buffer> {
    const bucket = await this.client.bucket(MongodbBucket.Projects);
    const stream = bucket.openDownloadStreamByName(projectId);
    return StreamReader.read(stream);
  }

  public async list(userId: string, offset: number, limit: number): Promise<ProjectDocument[]> {
    const coll = await this.client.collection<ProjectDocument>(MongodbCollection.Projects);
    return coll
      .find({ userId: { $eq: userId } })
      .skip(offset)
      .limit(limit)
      .toArray();
  }
}
