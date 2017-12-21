import {Db} from 'mongodb';

export abstract class AbstractDao {

    protected db: Db;

    constructor(db: Db) {
        this.db = db;
    }
}
