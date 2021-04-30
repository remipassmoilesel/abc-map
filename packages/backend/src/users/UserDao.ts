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
import { UserDocument } from './UserDocument';
import { MongodbCollection } from '../mongodb/MongodbCollection';

export class UserDao {
  constructor(private config: Config, private client: MongodbClient) {}

  public async init(): Promise<void> {
    const coll = await this.client.collection<UserDocument>(MongodbCollection.Users);
    await coll.createIndex('email', { unique: true });
  }

  public async save(project: UserDocument): Promise<void> {
    const coll = await this.client.collection<UserDocument>(MongodbCollection.Users);
    await coll.replaceOne({ _id: project._id }, project, { upsert: true });
  }

  public async findById(id: string): Promise<UserDocument | undefined> {
    const coll = await this.client.collection<UserDocument>(MongodbCollection.Users);
    const res = await coll.findOne({ _id: id });
    return res || undefined;
  }

  public async findByEmail(email: string): Promise<UserDocument | undefined> {
    const coll = await this.client.collection<UserDocument>(MongodbCollection.Users);
    const res = await coll.findOne({ email });
    return res || undefined;
  }
}
