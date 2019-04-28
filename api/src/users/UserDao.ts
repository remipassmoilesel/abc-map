import {Logger} from 'loglevel';
import {AbstractMongodbDao} from '../lib/database/AbstractMongodbDao';
import {IDbUser} from './IDbUser';
import loglevel = require('loglevel');

export class UserDao extends AbstractMongodbDao<IDbUser> {

    protected logger: Logger = loglevel.getLogger('UserDao');
    protected collectionName = 'users';

    public async createCollection(): Promise<any> {
        await this.db().createCollection(this.collectionName);
        await this.db().collection(this.collectionName).createIndex({username: 1, email: 1}, {unique: true});
    }

    public async findByUsername(username: string): Promise<IDbUser> {
        const result = await this.client().db(this.databasename).collection(this.collectionName).findOne({username: username});
        if (!result) {
            return Promise.reject(new Error('Not found'));
        }
        return result;
    }

}
