import {Db, InsertOneWriteOpResult} from "mongodb";
import {Project} from "../entities/Project";

export class ProjectDao {

    private readonly projectCollectionId = "project";
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    public insert(document: Project): Promise<InsertOneWriteOpResult> {
        return this.db.collection(this.projectCollectionId).insertOne(document);
    }

    public query() {
        return this.db.collection(this.projectCollectionId).find({});
    }

}