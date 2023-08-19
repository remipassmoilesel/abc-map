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
import { MongodbCollection } from '../mongodb/MongodbCollection';
import { RegistrationDocument } from './RegistrationDocument';

export class RegistrationDao {
  constructor(private client: MongodbClient) {}

  public async init(): Promise<void> {
    const coll = await this.collection();
    await coll.createIndex('email', { unique: false });
  }

  public async save(registration: RegistrationDocument): Promise<void> {
    const coll = await this.collection();
    await coll.replaceOne({ _id: registration._id }, registration, { upsert: true });
  }

  public async findById(id: string): Promise<RegistrationDocument | undefined> {
    const coll = await this.collection();
    const res = await coll.findOne({ _id: id });
    return res || undefined;
  }

  public async findByEmail(email: string): Promise<RegistrationDocument | undefined> {
    const coll = await this.collection();
    const res = await coll.findOne({ email });
    return res || undefined;
  }

  public async deleteById(id: string): Promise<void> {
    const coll = await this.collection();
    await coll.deleteOne({ _id: id });
  }

  private collection() {
    return this.client.collection<RegistrationDocument>(MongodbCollection.Registrations);
  }
}
