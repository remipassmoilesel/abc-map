import {Db, InsertOneWriteOpResult} from 'mongodb';
import {Project} from '../entities/Project';
import {AbstractDao} from './AbstractDao';
import {Logger} from "../dev/Logger";

const logger = Logger.getLogger('ProjectDao');

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

        try {
            const rawProjects: any[] = await this.db.collection(this.projectCollectionId).find({}).toArray();

            if (rawProjects.length > 1) {
                logger.warning(`Invalid number of project found: ${JSON.stringify(rawProjects)}`);
            }

            if (rawProjects.length > 0) {
                return this.entitySerializer.plainToClass(rawProjects[0]);
            } else {
                return null;
            }

        } catch (e) {
            logger.error('Error while fetching projects', e);
            return null;
        }

    }

    public update(project: Project) {
        return this.db.collection(this.projectCollectionId).updateOne({_id: project._id}, project);
    }

}
