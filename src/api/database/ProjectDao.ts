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
        return this.db.collection(this.projectCollectionId).insertOne(project);
    }

    public async query(): Promise<Project> {
        const rawProject: any[] = await this.db.collection(this.projectCollectionId).find({}).toArray();
        if (rawProject.length !== 1) {
            throw new Error('Invalid number of projects: ' + rawProject.length);
        }

        const pr = new Project();
        pr.fromRaw(rawProject[0]);

        return pr;
    }

    public update(project: Project) {
        return this.db.collection(this.projectCollectionId).updateOne({_id: project._id}, project);
    }

    public exportProjectAs(path: string) {

    }

}
