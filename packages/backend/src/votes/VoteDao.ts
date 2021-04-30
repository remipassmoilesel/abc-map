import { MongodbClient } from '../mongodb/MongodbClient';
import { VoteDocument } from './VoteDocument';
import { MongodbCollection } from '../mongodb/MongodbCollection';

export interface VoteAggregation {
  value: number;
  count: number;
}

export class VoteDao {
  constructor(private client: MongodbClient) {}

  public async init(): Promise<void> {
    const coll = await this.client.collection<VoteDocument>(MongodbCollection.Votes);
    await coll.createIndex({ date: 1 });
  }

  public async save(vote: VoteDocument): Promise<void> {
    const coll = await this.client.collection<VoteDocument>(MongodbCollection.Votes);
    await coll.replaceOne({ _id: vote._id }, vote, { upsert: true });
  }

  public async aggregate(start: Date, end: Date): Promise<VoteAggregation[]> {
    const coll = await this.client.collection<VoteDocument>(MongodbCollection.Votes);
    const aggregation = await coll
      .aggregate<{ _id: number; count: number }>([
        {
          $match: {
            date: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $group: {
            _id: '$value',
            count: {
              $sum: 1,
            },
          },
        },
      ])
      .toArray();

    return aggregation.map((raw) => ({ value: raw._id, count: raw.count }));
  }
}
