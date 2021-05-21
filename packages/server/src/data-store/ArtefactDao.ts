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

import { Config } from '../config/Config';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ArtefactDocument } from './ArtefactDocument';
import { MongodbCollection } from '../mongodb/MongodbCollection';
import { FilterQuery } from 'mongodb';

export class ArtefactDao {
  constructor(private config: Config, private client: MongodbClient) {}

  public async init() {
    const coll = await this.collection();
    await coll.createIndex(
      {
        name: 'text',
        description: 'text',
        keywords: 'text',
      },
      {
        default_language: 'french',
      }
    );
  }

  public async save(artefact: ArtefactDocument): Promise<void> {
    const coll = await this.collection();
    await coll.replaceOne({ _id: artefact._id }, artefact, { upsert: true });
  }

  public async saveAll(artefacts: ArtefactDocument[]): Promise<void> {
    const coll = await this.collection();

    const operations = artefacts.map((art) => ({
      replaceOne: {
        filter: {
          _id: art._id,
        },
        replacement: art,
        upsert: true,
      },
    }));

    await coll.bulkWrite(operations);
  }

  public async findById(id: string): Promise<ArtefactDocument | undefined> {
    const coll = await this.collection();
    const res = await coll.findOne({ _id: id });
    return res || undefined;
  }

  public async list(limit: number, offset: number): Promise<ArtefactDocument[]> {
    const coll = await this.collection();
    return coll.find({}).sort({ name: 1, _id: 1 }).skip(offset).limit(limit).toArray();
  }

  public async search(query: string, limit: number, offset: number): Promise<ArtefactDocument[]> {
    const coll = await this.collection();
    const cleanQuery = query.toLocaleLowerCase().trim();

    // First we try a text search
    const results = await coll
      .find({ $text: { $search: cleanQuery } })
      .project({ score: { $meta: 'textScore' } })
      .limit(limit)
      .skip(offset)
      .sort({ score: { $meta: 'textScore' } })
      .toArray();

    if (results.length) {
      return results;
    }

    // If nothing were found, we list document name beginning with needle
    else {
      const regexp = new RegExp(`^${cleanQuery}`, 'i');
      const query: FilterQuery<ArtefactDocument> = {
        $or: [{ name: { $regex: regexp } }, { description: { $regex: regexp } }],
      };

      return coll.find(query).limit(limit).skip(offset).sort({ name: 1, _id: 1 }).toArray();
    }
  }

  public async deleteAll(): Promise<void> {
    const coll = await this.collection();
    return coll.deleteMany({}).then(() => undefined);
  }

  public async count(): Promise<number> {
    const coll = await this.collection();
    return coll.countDocuments();
  }

  private async collection() {
    return this.client.collection<ArtefactDocument>(MongodbCollection.Artefacts);
  }
}
