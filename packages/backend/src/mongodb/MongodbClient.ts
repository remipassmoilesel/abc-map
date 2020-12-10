import { Collection, Db, MongoClient, MongoClientOptions, ObjectID } from 'mongodb';
import { Config } from '../config/Config';
import { MongoCollection } from './MongoCollection';
import { MongodbDocument } from './MongodbDocument';

/**
 * MongoDB client wrapper.
 *
 * This class allow to get a configured MongoDB client for current environment.
 *
 * It can help for simple tasks too (createIndex, insert, etc ...)
 *
 * For more advanced operations, use db() or collection()
 *
 * TODO: ensure that all used fields for selection have indexes.
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

  public async disconnect(): Promise<void> {
    if (this.client.isConnected()) {
      return this.client.close();
    }
  }

  public async insertOne(collectionName: MongoCollection, document: MongodbDocument): Promise<void> {
    if (!this.dbRef) {
      return Promise.reject(new Error('Not connected'));
    }
    const collection = await this.dbRef.collection(collectionName);
    return collection.insertOne(document).then(() => void 0);
  }

  public async findById(collectionName: MongoCollection, documentId: ObjectID | string): Promise<MongodbDocument | undefined> {
    if (!this.dbRef) {
      return Promise.reject(new Error('Not connected'));
    }
    const docId: ObjectID = documentId instanceof ObjectID ? documentId : new ObjectID(documentId);
    const collection = await this.dbRef.collection(collectionName);
    return collection.findOne({ _id: docId }).then((res) => (res ? res : undefined));
  }

  public async db(): Promise<Db> {
    if (!this.dbRef) {
      return Promise.reject(new Error('Not connected'));
    }
    return this.dbRef;
  }

  public async collection<T>(collectionName: MongoCollection): Promise<Collection<T>> {
    if (!this.dbRef) {
      return Promise.reject(new Error('Not connected'));
    }
    return this.dbRef.collection(collectionName);
  }

  private databaseName(): string {
    return `abc-${this.config.environmentName}`;
  }
}
