import * as mongodb from 'mongodb';
import {Db, InsertOneWriteOpResult, MongoClient} from 'mongodb';
import {Logger} from 'loglevel';
import {IApiConfig} from '../../IApiConfig';

export abstract class AbstractMongodbDao<T> {

    protected abstract logger: Logger;

    protected databasename = 'abcmap';
    protected abstract collectionName: string;

    protected _client?: MongoClient;

    constructor(private config: IApiConfig) {

    }

    public async connect(): Promise<MongoClient> {
        const username = this.config.mongodb.username;
        const password = this.config.mongodb.password;
        const port = this.config.mongodb.port;

        const databaseUri = `mongodb://${username}:${password}@localhost:${port}`;
        this._client = await mongodb.connect(databaseUri, {
            useNewUrlParser: true,
        });

        return Promise.resolve(this._client);
    }

    public async insert(object: T): Promise<InsertOneWriteOpResult> {
        if (!this._client) {
            return Promise.reject('Not connected');
        }
        return this._client
            .db(this.databasename)
            .collection(this.collectionName)
            .insertOne(object);
    }

    protected client(): MongoClient {
        if (!this._client) {
            throw new Error('Not connected');
        }
        return this._client;
    }

    protected db(): Db {
        return this.client().db(this.databasename);
    }

}
