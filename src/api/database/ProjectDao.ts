import {Db, InsertOneWriteOpResult} from 'mongodb';
import {Project} from '../entities/Project';
import {AbstractDao} from './AbstractDao';

export class ProjectDao extends AbstractDao {

    private readonly projectCollectionId = 'project';

    constructor(db: Db) {
        super(db);
    }

    public clear(): Promise<any> {
        return this.db.dropCollection(this.projectCollectionId);
    }

    public insert(project: Project): Promise<InsertOneWriteOpResult> {
        const serializedProject = this.entitySerializer.classToPlain(project);
        return this.db.collection(this.projectCollectionId).insertOne(serializedProject);
    }

    public async query(): Promise<Project | null> {

        const rawProject: any[] = await this.db.collection(this.projectCollectionId).find({}).toArray();
        if (rawProject.length > 1) {
            throw new Error('Invalid number of projects: ' + rawProject.length);
        }

        if (rawProject.length === 1) {
            return this.entitySerializer.plainToClass(rawProject[0]);
        } else {
            return null;
        }
    }

    public update(project: Project) {
        return this.db.collection(this.projectCollectionId).updateOne({_id: project._id}, project);
    }

}
