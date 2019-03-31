import {ProjectDao} from "./ProjectDao";
import {IProject} from "../../../shared/dist";
import * as uuid from 'uuid';
import * as loglevel from "loglevel";

export class ProjectService {

    private logger = loglevel.getLogger("ProjectService");

    constructor(private projectDao: ProjectDao) {
        this.projectDao.connect().catch(err => this.logger.error(err))
    }

    public getProject(projectId: string): Promise<IProject> {
        return this.projectDao.findById(projectId);
    }

    public createEmptyProject(projectName: string): Promise<IProject> {
        const newProject: IProject = {
            id: uuid.v4().toString(),
            name: projectName,
            activeLayer: null,
            layers: []
        };
        return this.projectDao.save(newProject).then(() => newProject);
    }

}
