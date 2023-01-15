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
import { CreateIndexesOptions, Filter, IndexSpecification } from 'mongodb';
import { MongoLanguage } from '../mongodb/MongodbI18n';
import { ArtefactFilter, ArtefactType } from '@abc-map/shared';

export class ArtefactDao {
  constructor(private config: Config, private client: MongodbClient) {}

  public async init() {
    const coll = await this.collection();

    const specs: IndexSpecification = {
      'name.text': 'text',
      'description.text': 'text',
      'keywords.text': 'text',
    };

    const options: CreateIndexesOptions = {
      name: 'artefact_search',
      default_language: 'english',
      language_override: 'language',
      weights: {
        'name.text': 10,
        'keywords.text': 5,
      },
    };
    await coll.createIndex(specs, options);

    await coll.createIndex({ name: 1 }, { unique: false });
  }

  public async save(artefact: ArtefactDocument): Promise<void> {
    const coll = await this.collection();
    await coll.replaceOne({ _id: artefact._id }, artefact, { upsert: true });
  }

  public async saveAll(artefacts: ArtefactDocument[]): Promise<void> {
    const coll = await this.collection();

    const operations = artefacts.map((artefact) => ({
      replaceOne: {
        filter: { _id: artefact._id },
        replacement: artefact,
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

  public async list(limit: number, offset: number, filter: ArtefactFilter): Promise<ArtefactDocument[]> {
    const coll = await this.collection();

    let query: Filter<ArtefactDocument> = {};
    if (filter && filter !== ArtefactFilter.All) {
      query = this.filter(filter);
    }

    return coll.find(query).sort({ type: 1, weight: -1, name: 1, _id: 1 }).skip(offset).limit(limit).toArray();
  }

  public async search(textQuery: string, lang: MongoLanguage, limit: number, offset: number, filter: ArtefactFilter): Promise<ArtefactDocument[]> {
    const coll = await this.collection();
    const cleanQuery = textQuery.toLocaleLowerCase().trim();

    // First we try a text search
    const query: Filter<ArtefactDocument> = {
      $and: [{ $text: { $search: cleanQuery, $language: lang, $caseSensitive: false, $diacriticSensitive: false } }],
    };

    if (filter && filter !== ArtefactFilter.All) {
      query.$and?.push(this.filter(filter));
    }

    const results = await coll
      .find(query)
      .project<ArtefactDocument>({ score: { $meta: 'textScore' } })
      .limit(limit)
      .skip(offset)
      .sort({ score: { $meta: 'textScore' }, type: 1, weight: -1, _id: 1 })
      .toArray();

    // If results found, we stop
    if (results.length) {
      return results;
    }

    // If nothing were found, we list document name beginning with needle
    else {
      const regexp = new RegExp(`^${cleanQuery}`, 'i');
      const query: Filter<ArtefactDocument> = {
        $or: [{ 'name.text': { $regex: regexp } }, { 'description.text': { $regex: regexp } }, { 'keywords.text': { $regex: regexp } }],
      };

      if (filter && filter !== ArtefactFilter.All) {
        query.$and = [this.filter(filter)];
      }

      return coll.find(query).limit(limit).skip(offset).sort({ name: 1, type: 1, weight: -1, _id: 1 }).toArray();
    }
  }

  public async deleteAll(): Promise<void> {
    const coll = await this.collection();
    return coll.deleteMany({}).then(() => undefined);
  }

  public async delete(toDelete: ArtefactDocument[]) {
    if (!toDelete.length) {
      return;
    }

    const coll = await this.collection();
    const ids = toDelete.map((d) => d._id);
    return coll.deleteMany({ _id: { $in: ids } });
  }

  public async count(filter: ArtefactFilter): Promise<number> {
    const coll = await this.collection();

    let query: Filter<ArtefactDocument> = {};
    if (filter && filter !== ArtefactFilter.All) {
      query = this.filter(filter);
    }

    return coll.countDocuments(query);
  }

  public async findAll(): Promise<ArtefactDocument[]> {
    const coll = await this.collection();
    return coll.find({}).toArray();
  }

  private filter(filter: ArtefactFilter): Filter<ArtefactDocument> {
    switch (filter) {
      case ArtefactFilter.OnlyBaseMaps:
        return { type: { $eq: ArtefactType.BaseMap } };
      case ArtefactFilter.OnlyVectors:
        return { type: { $eq: ArtefactType.Vector } };
      default:
        throw new Error(`Unsupported filter: ${filter}`);
    }
  }

  private async collection() {
    return this.client.collection<ArtefactDocument>(MongodbCollection.Artefacts);
  }
}
