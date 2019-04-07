import {Logger} from 'loglevel';
import {IProject} from 'abcmap-shared';
import {AbstractMongodbDao} from '../lib/database/AbstractMongodbDao';
import {UpdateWriteOpResult} from 'mongodb';
import loglevel = require('loglevel');

export class ProjectDao extends AbstractMongodbDao<IProject> {

    protected logger: Logger = loglevel.getLogger('ProjectDao');
    protected collectionName = 'projects';

    public async findById(projectId: string): Promise<IProject> {
        if (!this.client) {
            return Promise.reject('Not connected');
        }
        const result = await this.client.db(this.databasename).collection(this.collectionName).findOne({id: projectId});
        if (!result) {
            return Promise.reject(new Error('Not found'));
        }
        return result;
    }

    public async update(project: IProject): Promise<UpdateWriteOpResult> {
        if (!this.client) {
            return Promise.reject('Not connected');
        }
        return this.client.db(this.databasename)
            .collection(this.collectionName)
            .replaceOne({id: {$eq: project.id}}, project);
    }

}
