import {ProjectDao} from './ProjectDao';
import * as loglevel from 'loglevel';
import {DefaultLayers, IProject, IProjectEventContent, ProjectEvent} from 'abcmap-shared';
import {ProjectHelper} from './ProjectHelper';
import {LayerHelper} from './LayerHelper';
import EventEmitter = require('events');
import {MongodbHelper} from '../lib/database/MongodbHelper';

export class ProjectService {

    private logger = loglevel.getLogger('ProjectService');
    private emitter = new EventEmitter();

    constructor(private projectDao: ProjectDao) {
        this.projectDao.connect().catch((err) => this.logger.error(err));
    }

    public async findProject(projectId: string): Promise<IProject> {
        const project = await this.projectDao.findById(projectId);
        return MongodbHelper.withoutMongoId(project);
    }

    public updateProject(project: IProject): Promise<IProject> {
        return this.projectDao.update(project).then((insertResult) => {
            this.notifyProjectUpdated(project.id);
            return MongodbHelper.withoutMongoId(project);
        });
    }

    public async createNewProject(projectName: string): Promise<IProject> {
        if (!projectName) {
            return Promise.reject('Project name is mandatory');
        }
        const newProject: IProject = {
            id: ProjectHelper.generateProjectId(),
            name: projectName,
            activeLayer: null,
            layers: [
                LayerHelper.newPredefinedLayer(DefaultLayers.OSM_LAYER),
                LayerHelper.newVectorLayer(),
            ],
        };
        await this.projectDao.insert(newProject);
        return MongodbHelper.withoutMongoId(newProject);
    }

    public notifyProjectUpdated(projectId: string) {
        const eventContent: IProjectEventContent = {name: ProjectEvent.PROJECT_UPDATED, projectId};
        this.emitter.emit(ProjectEvent.PROJECT_UPDATED, eventContent);
    }

    public getEmitter(): NodeJS.EventEmitter {
        return this.emitter;
    }

}
