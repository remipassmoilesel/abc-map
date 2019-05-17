import {Logger} from 'loglevel';
import {IProject} from 'abcmap-shared';
import {AbstractMongodbDao} from '../lib/database/AbstractMongodbDao';
import {UpdateWriteOpResult} from 'mongodb';
import loglevel = require('loglevel');

export class ProjectDao extends AbstractMongodbDao<IProject> {

    protected logger: Logger = loglevel.getLogger('ProjectDao');
    protected collectionName = 'projects';

    public async findById(projectId: string): Promise<IProject> {
        const result = await this.collection().findOne({id: projectId});
        if (!result) {
            return Promise.reject(new Error('Not found'));
        }
        return result;
    }

    public async update(project: IProject): Promise<UpdateWriteOpResult> {
        return this.client().db(this.databaseName)
            .collection(this.collectionName)
            .replaceOne({id: {$eq: project.id}}, project);
    }

}
