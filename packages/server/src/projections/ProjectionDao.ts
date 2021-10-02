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
import { Config } from '../config/Config';
import { MongodbCollection } from '../mongodb/MongodbCollection';
import { ProjectionDocument } from './ProjectionDocument';

export class ProjectionDao {
  constructor(private config: Config, private client: MongodbClient) {}

  public async init(): Promise<void> {
    const coll = await this.collection();
    await coll.createIndex('code', { unique: true });
  }

  public async count(): Promise<number> {
    const coll = await this.collection();
    return coll.countDocuments();
  }

  public async findByCode(code: string): Promise<ProjectionDocument | undefined> {
    const coll = await this.collection();
    return coll.findOne({ code }).then((res) => res || undefined);
  }

  public async upsertByCode(docs: ProjectionDocument[]): Promise<void> {
    if (!docs.length) {
      return;
    }

    const coll = await this.collection();
    await coll.bulkWrite(
      docs.map((doc) => ({
        replaceOne: {
          filter: { code: doc.code },
          replacement: doc,
          upsert: true,
        },
      }))
    );
  }

  private async collection() {
    return this.client.collection<ProjectionDocument>(MongodbCollection.Projections);
  }
}
