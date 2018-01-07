import * as uuid from 'uuid';
import {Db, InsertWriteOpResult} from 'mongodb';
import {EntitySerializer} from '../entities/serializer/EntitySerializer';
import {EntitySerializerFactory} from '../entities/serializer/EntitySerializerFactory';

export abstract class AbstractDao {

    protected db: Db;
    protected entitySerializer: EntitySerializer;

    constructor(db: Db) {
        this.db = db;
        this.entitySerializer = EntitySerializerFactory.newInstance();
    }

    protected insertRaw(collectionId: string, document: any): Promise<InsertWriteOpResult> {
        return this.insertManyRaw(collectionId, [document]);
    }

    protected insertManyRaw(collectionId: string, dataArray: any[]): Promise<InsertWriteOpResult> {
        for (const data of dataArray) {
            this.generateIdIfNecessary(data);
        }
        return this.db.collection(collectionId).insertMany(dataArray);
    }

    protected generateIdIfNecessary(document: any) {
        if (!document._id) {
            document._id = uuid.v4();
        }
    }
}
