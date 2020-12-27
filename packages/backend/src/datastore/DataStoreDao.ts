import { Config } from '../config/Config';
import { MongodbClient } from '../mongodb/MongodbClient';
import { ArtefactDocument } from './ArtefactDocument';
import { MongoCollection } from '../mongodb/MongoCollection';

export class DataStoreDao {
  constructor(private config: Config, private client: MongodbClient) {}

  // TODO: add weights
  public async createIndexes() {
    const coll = await this.client.collection<ArtefactDocument>(MongoCollection.Artefacts);
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
    const coll = await this.client.collection<ArtefactDocument>(MongoCollection.Artefacts);
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

    const coll = await this.client.collection<ArtefactDocument>(MongoCollection.Artefacts);
    await coll.bulkWrite(operations);
  }

  public async findById(id: string): Promise<ArtefactDocument | undefined> {
    const coll = await this.client.collection<ArtefactDocument>(MongoCollection.Artefacts);
    const res = await coll.findOne({ _id: id });
    return res || undefined;
  }

  public async list(offset: number, limit: number): Promise<ArtefactDocument[]> {
    const coll = await this.client.collection<ArtefactDocument>(MongoCollection.Artefacts);
    return coll.find({}).skip(offset).limit(limit).toArray();
  }

  public async search(query: string, offset: number, limit: number): Promise<ArtefactDocument[]> {
    const coll = await this.client.collection<ArtefactDocument>(MongoCollection.Artefacts);
    return coll
      .find({ $text: { $search: query } })
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  public async deleteAll(): Promise<void> {
    const coll = await this.client.collection<ArtefactDocument>(MongoCollection.Artefacts);
    return coll.deleteMany({}).then(() => undefined);
  }
}
