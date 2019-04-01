import {Logger} from 'loglevel';
import {IProject} from "../../../shared/dist";
import {AbstractMongodbDao} from "../lib/database/AbstractMongodbDao";
import loglevel = require("loglevel");

export class ProjectDao extends AbstractMongodbDao<IProject> {

    protected logger: Logger = loglevel.getLogger("ProjectDao");
    protected collectionName = "projects";

    findById(objectid: string): Promise<IProject> {
        if (!this.client) {
            return Promise.reject("Not connected");
        }
        return this.client.db(this.databasename).collection(this.collectionName).findOne({id: objectid})
            .then(result => {
                if (!result) {
                    return Promise.reject(new Error("Not found"));
                }
                return result;
            });
    }

}
