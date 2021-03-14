import { Collection, Db, GridFSBucket, MongoClient, MongoClientOptions } from 'mongodb';
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
      useUnifiedTopology: true,
      connectTimeoutMS: 5_000,
      socketTimeoutMS: 5_000,
      serverSelectionTimeoutMS: 5_000,
      auth: {
        user: config.database.username,
        password: config.database.password,
      },
    };
    this.client = new MongoClient(this.config.database.url, options);
  }

  public async connect(): Promise<void> {
    if (this.client.isConnected()) {
      // Warning: call connect on already connected client cause undefined behaviors
      return Promise.reject(new Error('Mongodb client already connected'));
    }

    await this.client.connect();
    this.dbRef = this.client.db(this.databaseName());
  }

  public isConnected(): boolean {
    return this.client.isConnected();
  }

  public async disconnect(): Promise<void> {
    if (this.client.isConnected()) {
      return this.client.close();
    }
  }

  public async db(): Promise<Db> {
    if (!this.dbRef) {
      return Promise.reject(new Error('Not connected'));
    }
    return this.dbRef;
  }

  public async collection<T>(collectionName: MongodbCollection): Promise<Collection<T>> {
    const db = await this.db();
    return db.collection(collectionName);
  }

  public async bucket(bucketName: MongodbBucket): Promise<GridFSBucket> {
    const db = await this.db();
    return new GridFSBucket(db, { bucketName });
  }

  private databaseName(): string {
    return `abc-${this.config.environmentName}`;
  }
}
