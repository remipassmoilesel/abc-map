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
import { Readable } from 'stream';

export class ProjectDao {
  constructor(private client: MongodbClient) {}

  public async saveMetadata(project: ProjectDocument): Promise<void> {
    const coll = await this.collection();
    await coll.replaceOne({ _id: project._id }, project, { upsert: true });
  }

  public async saveCompressedFile(projectId: string, file: Buffer | ReadableStream): Promise<void> {
    const bucket = await this.bucket();
    const upload = bucket.openUploadStream(projectId);

    const res: Promise<void> = new Promise((resolve, reject) => {
      upload.on('finish', () => resolve());
      upload.on('error', (err) => reject(err));
    });

    if (file instanceof Buffer) {
      const fileStream = Readable.from(file);
      fileStream.pipe(upload);
    } else {
      file.pipe(upload);
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
