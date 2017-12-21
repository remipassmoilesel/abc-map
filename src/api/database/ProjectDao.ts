import {Db, InsertOneWriteOpResult} from "mongodb";
import {Project} from "../entities/Project";

export class ProjectDao {

    private readonly projectCollectionId = "project";
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    public clear(): Promise<any> {
        return this.db.dropCollection(this.projectCollectionId);
    }

    public insert(document: Project): Promise<InsertOneWriteOpResult> {
        return this.db.collection(this.projectCollectionId).insertOne(document);
    }

    public query(): Promise<Project> {
        return this.db.collection(this.projectCollectionId).find({}).toArray().then((arr) => {
            if (arr.length !== 1) {
                throw new Error('Invalid number of projects: ' + arr.length);
            }
            return arr[0];
        });
    }

    public update(project: Project) {
        return this.db.collection(this.projectCollectionId).updateOne({_id: project._id}, project);
    }

    public exportProjectAs(path: string) {

    }

}