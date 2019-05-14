import {AbstractMongodbDao} from '../lib/database/AbstractMongodbDao';
import {Logger} from 'loglevel';
import {IDocument} from 'abcmap-shared';
import loglevel = require('loglevel');

export class DocumentDao extends AbstractMongodbDao<IDocument> {

    protected logger: Logger = loglevel.getLogger('ProjectDao');
    protected collectionName: string = 'documents';

    public async createCollection(): Promise<any> {
        await super.createCollection();
        await this.collection().createIndex({description: 'text'});
        await this.collection().createIndex({path: 1}, {unique: true});
    }

    public listDocuments(start: number, size: number): Promise<IDocument[]> {
        return this.collection().find().skip(start).limit(size).toArray();
    }

    public deleteWithPath(path: string): Promise<any> {
        return this.collection().deleteOne({path});
    }

    public findDocumentsByPath(paths: string[]): Promise<IDocument[]> {
        return this.collection().find({path: {$in: paths}}).toArray();
    }
}
