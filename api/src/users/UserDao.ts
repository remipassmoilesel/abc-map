import {Logger} from 'loglevel';
import {AbstractMongodbDao} from '../lib/database/AbstractMongodbDao';
import {IDbUser} from './IDbUser';
import loglevel = require('loglevel');

export class UserDao extends AbstractMongodbDao<IDbUser> {

    protected logger: Logger = loglevel.getLogger('UserDao');
    protected collectionName = 'users';

    public async createCollection(): Promise<any> {
        await super.createCollection();
        await this.db().collection(this.collectionName)
            .createIndex({username: 1, email: 1}, {unique: true});
    }

    public async findByUsername(username: string): Promise<IDbUser> {
        const result = await this.client().db(this.databaseName)
            .collection(this.collectionName).findOne({username});
        if (!result) {
            return Promise.reject(new Error('Not found'));
        }
        return result;
    }

}
