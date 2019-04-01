import {ProjectDao} from './ProjectDao';
import {IProject, IProjectEventContent, MapLayerType, ProjectEvent} from '../../../shared/dist';
import * as uuid from 'uuid';
import * as loglevel from 'loglevel';
import EventEmitter = require('events');

export class ProjectService {

    private logger = loglevel.getLogger('ProjectService');
    private _emitter = new EventEmitter();

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
            id: this.generateProjectId(),
            name: projectName,
            activeLayer: null,
            layers: [{
                id: this.generateLayerId(MapLayerType.RasterOsm),
                name: 'Couche OpenStreetMap',
                type: MapLayerType.RasterOsm,
            }],
        };
        return this.projectDao.save(newProject)
            .then(() => newProject);
    }

    public notifyProjectUpdated(projectId: string) {
        const eventContent: IProjectEventContent = {name: ProjectEvent.PROJECT_UPDATED, projectId};
        this._emitter.emit(ProjectEvent.PROJECT_UPDATED, eventContent);
    }

    public getEmitter(): NodeJS.EventEmitter {
        return this._emitter;
    }

    private generateProjectId(): string {
        return `project-${uuid.v4()}`.toLocaleLowerCase();
    }

    private generateLayerId(layer: MapLayerType): string {
        return `${layer}-${uuid.v4()}`.toLocaleLowerCase();
    }
}
