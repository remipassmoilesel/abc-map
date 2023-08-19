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

import { Collection } from 'mongodb';
import { MigrationDocument } from './MigrationDocument';
import { MongodbClient } from '../MongodbClient';
import { MongodbCollection } from '../MongodbCollection';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('MigrationDao.ts', 'info');

export class MigrationDao {
  constructor(private mongodbClient: MongodbClient) {}

  public async init(): Promise<void> {
    const collection = await this.collection();
    await collection.createIndex({ name: 1 }, { unique: true });
  }

  public async insert(doc: MigrationDocument): Promise<void> {
    const collection = await this.collection();
    await collection.insertOne(doc);
  }

  public async findAll(): Promise<MigrationDocument[]> {
    const collection = await this.collection();
    return collection.find({}).toArray();
  }

  private collection(): Promise<Collection<MigrationDocument>> {
    return this.mongodbClient.collection<MigrationDocument>(MongodbCollection.DbMigrations);
  }
}
