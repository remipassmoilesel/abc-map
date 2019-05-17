import {AbstractMongodbDao} from '../lib/database/AbstractMongodbDao';
import {Logger} from 'loglevel';
import {IDocument} from 'abcmap-shared';
import loglevel = require('loglevel');

export class DocumentDao extends AbstractMongodbDao<IDocument> {

    protected logger: Logger = loglevel.getLogger('ProjectDao');
    protected collectionName: string = 'documents';

    public async createCollection(): Promise<any> {
        await super.createCollection();
        await this.collection().createIndex({description: 'text', path: 'text'});
        await this.collection().createIndex({path: 1}, {unique: true});
    }

    public list(start: number, size: number): Promise<IDocument[]> {
        return this.collection().find().skip(start).limit(size).toArray();
    }

    public deleteByPath(path: string): Promise<any> {
        return this.collection().deleteOne({path});
    }

    public findManyByPath(paths: string[]): Promise<IDocument[]> {
        return this.collection().find({path: {$in: paths}}).toArray();
    }

    public async findByPath(path: string): Promise<IDocument> {
        const result = await this.collection().findOne({path: {$eq: path}});
        if (!result) {
            return Promise.reject(new Error('Document not found: ' + path));
        }
        return result;
    }

    public search(query: any): Promise<IDocument[]> {
        return this.collection()
            .find({$text: {$search: query}})
            .project({score: {$meta: 'textScore'}})
            .sort({score: {$meta: 'textScore'}})
            .toArray();
    }
}
