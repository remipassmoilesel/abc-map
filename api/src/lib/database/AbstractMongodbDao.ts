import * as mongodb from "mongodb";
import {InsertOneWriteOpResult, MongoClient} from "mongodb";
import {Logger} from 'loglevel';
import {AbcApiConfig} from "../../AbcApiConfig";

export abstract class AbstractMongodbDao<T> {

    protected abstract logger: Logger;

    protected databasename = "abcmap";
    protected abstract collectionName: string;

    protected client?: MongoClient;

    constructor(private config: AbcApiConfig){

    }

    public async connect(): Promise<MongoClient> {
        const username = this.config.MONGODB.username;
        const password = this.config.MONGODB.password;
        const port = this.config.MONGODB.port;

        const databaseUri = `mongodb://${username}:${password}@localhost:${port}`;
        this.client = await mongodb.connect(databaseUri, {
            useNewUrlParser: true,
        });

        return Promise.resolve(this.client);
    }

    public async save(object: T): Promise<InsertOneWriteOpResult> {
        if (!this.client) {
            return Promise.reject("Not connected");
        }
        return this.client.db(this.databasename).collection(this.collectionName).insertOne(object);
    }

}
