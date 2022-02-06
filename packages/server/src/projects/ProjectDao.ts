/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { MongodbClient } from '../mongodb/MongodbClient';
import { ProjectDocument } from './ProjectDocument';
import { MongodbCollection } from '../mongodb/MongodbCollection';
import { MongodbBucket } from '../mongodb/MongodbBucket';
import { Collection, GridFSBucket } from 'mongodb';
import ReadableStream = NodeJS.ReadableStream;
import WritableStream = NodeJS.WritableStream;
import { Readable } from 'stream';

export class ProjectDao {
  constructor(private client: MongodbClient) {}

  public async init(): Promise<void> {
    const coll = await this.collection();
    await coll.createIndex('ownerId', { unique: false });
  }

  public async findAllMetadata(limit: number, skip = 0): Promise<ProjectDocument[]> {
    const coll = await this.collection();
    return coll.find({}).limit(limit).skip(skip).toArray();
  }

  public async saveMetadata(project: ProjectDocument): Promise<void> {
    const coll = await this.collection();
    await coll.replaceOne({ _id: project._id }, project, { upsert: true });
  }

  public async saveAllMetadata(projects: ProjectDocument[]): Promise<void> {
    if (!projects.length) {
      return;
    }

    const coll = await this.collection();
    const bulk = coll.initializeUnorderedBulkOp();
    projects.forEach((doc) =>
      bulk
        .find({ _id: { $eq: doc._id } })
        .upsert()
        .replaceOne(doc)
    );
    await bulk.execute();
  }

  public async saveCompressedFile(projectId: string, file: Buffer | ReadableStream): Promise<void> {
    const bucket = await this.bucket();
    const upload = bucket.openUploadStream(projectId);

    const res: Promise<void> = new Promise((resolve, reject) => {
      upload.on('finish', () => resolve());
      upload.on('error', (err) => reject(err));
    });

    // Stream typings are borked
    if (file instanceof Buffer) {
      const fileStream = Readable.from(file);
      fileStream.pipe(upload as unknown as WritableStream);
    } else {
      file.pipe(upload as unknown as WritableStream);
    }

    return res;
  }

  public async findMetadataById(projectId: string): Promise<ProjectDocument | undefined> {
    const coll = await this.collection();
    const res = await coll.findOne({ _id: projectId });
    return res || undefined;
  }

  public async findCompressedFileById(projectId: string): Promise<Readable> {
    const bucket = await this.bucket();
    return bucket.openDownloadStreamByName(projectId);
  }

  public async list(userId: string, offset: number, limit: number): Promise<ProjectDocument[]> {
    const coll = await this.collection();
    return coll
      .find({ ownerId: { $eq: userId } })
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  public async deleteMetadataByIds(projectIds: string[]): Promise<void> {
    const coll = await this.collection();
    await coll.deleteMany({ _id: { $in: projectIds } });
  }

  public async deleteProjectsByIds(projectIds: string[]): Promise<void> {
    const bucket = await this.bucket();
    const files = await bucket.find({ filename: { $in: projectIds } }).toArray();
    await Promise.all(files.map((f) => bucket.delete(f._id)));
  }

  private collection(): Promise<Collection<ProjectDocument>> {
    return this.client.collection<ProjectDocument>(MongodbCollection.Projects);
  }

  private bucket(): Promise<GridFSBucket> {
    return this.client.bucket(MongodbBucket.Projects);
  }

  public async countByUserId(userId: string) {
    const collection = await this.collection();

    const pipeline: object[] = [
      {
        $match: {
          ownerId: userId,
        },
      },
      {
        $count: 'projects',
      },
    ];

    const cursor = collection.aggregate(pipeline);
    const result = (await cursor.next()) as unknown as { projects: number } | null;
    return result?.projects || 0;
  }

  public async exists(id: string): Promise<boolean> {
    const collection = await this.collection();
    return !!(await collection.find({ _id: id }).project({ _id: 1 }).limit(1).toArray());
  }
}
