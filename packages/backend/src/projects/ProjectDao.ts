import { MongodbClient } from '../mongodb/MongodbClient';
import { ProjectDocument } from './ProjectDocument';
import { MongodbCollection } from '../mongodb/MongodbCollection';
import { MongodbBucket } from '../mongodb/MongodbBucket';
import { Readable } from 'stream';
import { StreamReader } from '../utils/StreamReader';
import { Collection, GridFSBucket } from 'mongodb';

export class ProjectDao {
  constructor(private client: MongodbClient) {}

  public async saveMetadata(project: ProjectDocument): Promise<void> {
    const coll = await this.collection();
    await coll.replaceOne({ _id: project._id }, project, { upsert: true });
  }

  public async saveCompressedFile(projectId: string, file: Buffer): Promise<void> {
    const bucket = await this.bucket();
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
    const coll = await this.collection();
    const res = await coll.findOne({ _id: projectId });
    return res || undefined;
  }

  // TODO: we should stream file to client
  public async findCompressedFileById(projectId: string): Promise<Buffer> {
    const bucket = await this.bucket();
    const stream = bucket.openDownloadStreamByName(projectId);
    return StreamReader.read(stream);
  }

  public async list(userId: string, offset: number, limit: number): Promise<ProjectDocument[]> {
    const coll = await this.collection();
    return coll
      .find({ ownerId: { $eq: userId } })
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  public async deleteMetadataById(projectId: string): Promise<void> {
    const coll = await this.collection();
    await coll.deleteOne({ _id: projectId });
  }

  public async deleteCompressedFileById(projectId: string): Promise<void> {
    const bucket = await this.bucket();
    const file = await bucket.find({ filename: projectId }).toArray();
    if (file.length !== 1) {
      throw new Error(`Invalid file: ${projectId}`);
    }

    await bucket.delete(file[0]._id);
  }

  private collection(): Promise<Collection<ProjectDocument>> {
    return this.client.collection<ProjectDocument>(MongodbCollection.Projects);
  }

  private bucket(): Promise<GridFSBucket> {
    return this.client.bucket(MongodbBucket.Projects);
  }
}
