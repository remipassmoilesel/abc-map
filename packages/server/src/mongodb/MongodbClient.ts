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

import { Collection, Db, Document, GridFSBucket, MongoClient, MongoClientOptions } from 'mongodb';
import { Config } from '../config/Config';
import { MongodbCollection } from './MongodbCollection';
import { MongodbBucket } from './MongodbBucket';

/**
 * MongoDB client wrapper.
 *
 * This class allow to get a configured MongoDB client for current environment.
 *
 */
export class MongodbClient {
  private client: MongoClient;
  private dbRef?: Db;

  public static async createAndConnect(config: Config): Promise<MongodbClient> {
    const client = new MongodbClient(config);
    await client.connect();
    return client;
  }

  constructor(private config: Config) {
    const options: MongoClientOptions = {
      connectTimeoutMS: 5_000,
      socketTimeoutMS: 5_000,
      serverSelectionTimeoutMS: 5_000,
      auth: {
        username: config.database.username,
        password: config.database.password,
      },
    };
    this.client = new MongoClient(this.config.database.url, options);
  }

  public async connect(): Promise<void> {
    await this.client.connect();
    this.dbRef = this.client.db(this.databaseName());
  }

  public async disconnect(): Promise<void> {
    return this.client.close();
  }

  public async db(): Promise<Db> {
    if (!this.dbRef) {
      return Promise.reject(new Error('Not connected'));
    }
    return this.dbRef;
  }

  public async collection<T extends Document>(collectionName: MongodbCollection): Promise<Collection<T>> {
    const db = await this.db();
    return db.collection(collectionName);
  }

  public async bucket(bucketName: MongodbBucket): Promise<GridFSBucket> {
    const db = await this.db();
    return new GridFSBucket(db, { bucketName });
  }

  private databaseName(): string {
    return this.config.database.databaseName || `abc-${this.config.environmentName}`;
  }
}
