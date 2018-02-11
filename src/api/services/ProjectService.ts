import * as _ from 'lodash';
import {IProjectCreationOptions, Project} from '../entities/Project';
import {Logger} from '../dev/Logger';
import {Utils} from '../utils/Utils';
import {Ipc} from '../ipc/Ipc';
import {IpcEventBus} from '../ipc/IpcSubject';
import {EventType} from '../ipc/IpcEventTypes';
import {IpcEvent} from '../ipc/IpcEvent';
import {AbstractService} from './AbstractService';
import {AbstractMapLayer} from '../entities/layers/AbstractMapLayer';

const logger = Logger.getLogger('ProjectService');

export class ProjectService extends AbstractService {

    private saveInterval: number;
    private currentProject: Project;

    constructor(ipc: Ipc) {
        super(ipc);
        logger.info('Initialize project service');

        this.saveInterval = setInterval(this.persistProject.bind(this), 3 * 60 * 1000);
    }

    public persistProject() {
        logger.info('Automatic update of project in database ...');
        const projectDao = this.services.db.getProjectDao();
        const project = this.services.project.getCurrentProject();
        projectDao.update(project);
    }

    public async createNewProject() {
        logger.info('Create new project');

        const projectDao = this.services.db.getProjectDao();

        // TODO: do not drop previous project if not existing
        const previousProject: Project | null = await projectDao.query();
        if (previousProject) {
            await projectDao.clear();
        }

        // create a new project with a default layer
        const project: Project = await this.instantiateProject();
        await this.addLayer(this.services.map.getDefaultWmsLayers()[0]);

        await projectDao.insert(project);
    }

    private async instantiateProject(parameters?: IProjectCreationOptions): Promise<Project> {

        const params = Utils.withDefaultValues(parameters, {name: 'New project'});
        this.currentProject = new Project(params.name);

        await this.sendProjectEvent({
            data: this.currentProject,
            type: EventType.PROJECT_NEW_CREATED,
        });

        return this.currentProject;
    }

    public async addLayer(layer: AbstractMapLayer) {
        logger.info(`Adding layer: ${JSON.stringify(layer)}`);

        if (!layer.id) {
            layer.generateId();
            logger.info(`Layer id not set, generate a new one: ${layer.id}`);
        }

        this.currentProject.layers.push(layer);

        await this.sendProjectEvent({
            data: this.currentProject,
            type: EventType.PROJECT_NEW_LAYER_ADDED,
        });
    }

    public async addLayers(layers: any[]) {
        for (const lay of layers) {
            await this.addLayer(lay);
        }
    }

    public getCurrentProject(): Project {
        return this.currentProject;
    }

    public async deleteLayers(layerIds: string[]) {
        logger.info(`Deleting layers: ${layerIds}`);

        _.remove(this.currentProject.layers, (lay: AbstractMapLayer) => {
            return layerIds.indexOf(lay.id) !== -1;
        });

        await this.sendProjectEvent({
            data: this.currentProject,
            type: EventType.PROJECT_UPDATED,
        });

    }

    public async setActiveLayer(layerId: string) {
        const layer = _.find(this.currentProject.layers, (lay) => layerId === lay.id);
        if (!layer) {
            throw new Error(`Unknown id: ${layerId}`);
        }
        this.currentProject.activeLayer = layer;

        await this.sendProjectEvent({
            data: this.currentProject,
            type: EventType.PROJECT_UPDATED,
        });
    }

    public onAppExit(): Promise<void> {
        clearInterval(this.saveInterval);
        return Promise.resolve();
    }

    private sendProjectEvent(data: IpcEvent) {
        return this.ipc.send(IpcEventBus.PROJECT, data);
    }

}
