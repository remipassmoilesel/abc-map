import {ProjectDao} from "./ProjectDao";
import {IProject} from "../../../shared/dist";
import * as uuid from 'uuid';
import * as loglevel from "loglevel";
import {IProjectEventContent, ProjectEvent} from "../../../shared/src";
import EventEmitter = NodeJS.EventEmitter;

export class ProjectService {

    private logger = loglevel.getLogger("ProjectService");
    private _emitter = new EventEmitter();

    constructor(private projectDao: ProjectDao) {
        this.projectDao.connect().catch(err => this.logger.error(err))
    }

    public findProject(projectId: string): Promise<IProject> {
        return this.projectDao.findById(projectId);
    }

    public saveProject(project: IProject): Promise<IProject> {
        return this.projectDao.save(project).then(insertResult => {
            this.notifyProjectUpdated(project.id);
            return project;
        })
    }

    public createEmptyProject(projectName: string): Promise<IProject> {
        const newProject: IProject = {
            id: uuid.v4().toString(),
            name: projectName,
            activeLayer: null,
            layers: []
        };
        return this.projectDao.save(newProject)
            .then(() => newProject);
    }

    public notifyProjectUpdated(projectId: string) {
        const eventContent: IProjectEventContent = {name: ProjectEvent.PROJECT_UPDATED, projectId};
        this._emitter.emit(ProjectEvent.PROJECT_UPDATED, eventContent)
    }

    public getEmitter(): NodeJS.EventEmitter {
        return this._emitter;
    }
}
