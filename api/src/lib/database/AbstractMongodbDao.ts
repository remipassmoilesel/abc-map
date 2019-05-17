import * as mongodb from 'mongodb';
import {Collection, Db, InsertOneWriteOpResult, MongoClient, ReplaceWriteOpResult} from 'mongodb';
import {Logger} from 'loglevel';
import {IApiConfig} from '../../IApiConfig';


export abstract class AbstractMongodbDao<T> {

    protected abstract logger: Logger;
    protected abstract collectionName: string;

    protected databaseName: string;
    protected _client?: MongoClient;

    constructor(private config: IApiConfig) {
        this.databaseName = `abcmap-${config.environmentName}`;
    }

    public async postConstruct(): Promise<any> {
        await this.connect();
        await this.createCollection();
    }

    public async createCollection(): Promise<any> {
        await this.db().createCollection(this.collectionName);
    }

    public async connect(): Promise<MongoClient> {
        const port = this.config.mongodb.port;
        const host = this.config.mongodb.host;
        const databaseUri = `mongodb://${host}:${port}/${this.databaseName}`;
        this._client = await mongodb.connect(databaseUri, {
            useNewUrlParser: true,
        });

        return Promise.resolve(this._client);
    }

    public async insert(object: T): Promise<InsertOneWriteOpResult> {
        return this.collection().insertOne(object);
    }

    public upsertOne(filter: any, object: T): Promise<ReplaceWriteOpResult> {
        return this.collection().replaceOne(filter, object, {upsert: true});
    }

    protected client(): MongoClient {
        if (!this._client) {
            throw new Error('Not connected');
        }
        return this._client;
    }

    protected db(): Db {
        return this.client().db(this.databaseName);
    }

    protected collection(): Collection<T> {
        return this.db().collection<T>(this.collectionName);
    }

}
