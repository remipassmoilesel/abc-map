import {ProjectDao} from './ProjectDao';
import * as loglevel from 'loglevel';
import {IProject, IProjectEventContent, MapLayerType, ProjectEvent} from "abcmap-shared/dist";
import {ProjectHelper} from "./ProjectHelper";
import {DefaultLayers} from "abcmap-shared/dist";
import EventEmitter = require('events');

export class ProjectService {

    private logger = loglevel.getLogger('ProjectService');
    private emitter = new EventEmitter();

    constructor(private projectDao: ProjectDao) {
        this.projectDao.connect().catch((err) => this.logger.error(err));
    }

    public findProject(projectId: string): Promise<IProject> {
        return this.projectDao.findById(projectId);
    }

    public saveProject(project: IProject): Promise<IProject> {
        return this.projectDao.save(project).then((insertResult) => {
            this.notifyProjectUpdated(project.id);
            return project;
        });
    }

    public createNewProject(projectName: string): Promise<IProject> {
        if (!projectName) {
            return Promise.reject('Project name is mandatory');
        }
        const newProject: IProject = {
            id: ProjectHelper.generateLayerId(MapLayerType.Raster),
            name: projectName,
            activeLayer: null,
            layers: [DefaultLayers.OSM_LAYER],
        };
        return this.projectDao.save(newProject)
            .then(() => newProject);
    }

    public notifyProjectUpdated(projectId: string) {
        const eventContent: IProjectEventContent = {name: ProjectEvent.PROJECT_UPDATED, projectId};
        this.emitter.emit(ProjectEvent.PROJECT_UPDATED, eventContent);
    }

    public getEmitter(): NodeJS.EventEmitter {
        return this.emitter;
    }

}
