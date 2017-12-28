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

    private currentProject: Project;

    constructor(ipc: Ipc) {
        super(ipc);
        logger.info('Initialize project service');
    }

    public async newProject(parameters?: IProjectCreationOptions): Promise<Project> {
        logger.info('Create new project', parameters);

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

    public onAppExit(): Promise<void> {
        return Promise.resolve();
    }

    private sendProjectEvent(data: IpcEvent) {
        return this.ipc.send(IpcEventBus.PROJECT, data);
    }

}
