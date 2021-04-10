import { Config } from '../config/Config';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ArtefactDocument } from './ArtefactDocument';
import { MongodbCollection } from '../mongodb/MongodbCollection';
import { FilterQuery } from 'mongodb';

export class DataStoreDao {
  constructor(private config: Config, private client: MongodbClient) {}

  public async init() {
    const coll = await this.client.collection<ArtefactDocument>(MongodbCollection.Artefacts);
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
    const coll = await this.client.collection<ArtefactDocument>(MongodbCollection.Artefacts);
    await coll.replaceOne({ _id: artefact._id }, artefact, { upsert: true });
  }

  public async saveAll(artefacts: ArtefactDocument[]): Promise<void> {
    const operations = artefacts.map((art) => ({
      replaceOne: {
        filter: {
          _id: art._id,
        },
        replacement: art,
        upsert: true,
      },
    }));

    const coll = await this.client.collection<ArtefactDocument>(MongodbCollection.Artefacts);
    await coll.bulkWrite(operations);
  }

  public async findById(id: string): Promise<ArtefactDocument | undefined> {
    const coll = await this.client.collection<ArtefactDocument>(MongodbCollection.Artefacts);
    const res = await coll.findOne({ _id: id });
    return res || undefined;
  }

  public async list(limit: number, offset: number): Promise<ArtefactDocument[]> {
    const coll = await this.client.collection<ArtefactDocument>(MongodbCollection.Artefacts);
    return coll.find({}).sort({ name: 1, _id: 1 }).skip(offset).limit(limit).toArray();
  }

  public async search(query: string, limit: number, offset: number): Promise<ArtefactDocument[]> {
    const coll = await this.client.collection<ArtefactDocument>(MongodbCollection.Artefacts);
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

      return await coll.find(query).limit(limit).skip(offset).sort({ name: 1, _id: 1 }).toArray();
    }
  }

  public async deleteAll(): Promise<void> {
    const coll = await this.client.collection<ArtefactDocument>(MongodbCollection.Artefacts);
    return coll.deleteMany({}).then(() => undefined);
  }

  public async count(): Promise<number> {
    const coll = await this.client.collection<ArtefactDocument>(MongodbCollection.Artefacts);
    return coll.countDocuments();
  }
}
