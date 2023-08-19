/**
 * Copyright © 2023 Rémi Pace.
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
import { VoteDocument } from './VoteDocument';
import { MongodbCollection } from '../mongodb/MongodbCollection';

export interface VoteAggregation {
  value: number;
  count: number;
}

export class VoteDao {
  constructor(private client: MongodbClient) {}

  public async init(): Promise<void> {
    const coll = await this.collection();
    await coll.createIndex({ date: 1 });
  }

  public async save(vote: VoteDocument): Promise<void> {
    const coll = await this.collection();
    await coll.replaceOne({ _id: vote._id }, vote, { upsert: true });
  }

  public async aggregate(start: Date, end: Date): Promise<VoteAggregation[]> {
    const coll = await this.collection();
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

  private async collection() {
    return this.client.collection<VoteDocument>(MongodbCollection.Votes);
  }
}
