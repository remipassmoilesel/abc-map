import * as _ from "lodash";
import {IProjectCreationOptions, Project} from "../entities/Project";
import {Logger} from "../dev/Logger";
import {Utils} from "../utils/Utils";
import {Ipc} from "../ipc/Ipc";
import {IpcSubject} from "../ipc/IpcSubject";
import {EventType} from "../ipc/IpcEventTypes";
import {IpcEvent} from "../ipc/IpcEvent";
import {AbstractService} from "./AbstractService";
import {AbstractMapLayer} from "../entities/layers/AbstractMapLayer";

const logger = Logger.getLogger('ProjectService');

export class ProjectService extends AbstractService {

    private currentProject: Project;

    constructor(ipc: Ipc) {
        super(ipc);
        logger.info('Initialize project service');
    }

    public newProject(parameters?: IProjectCreationOptions): Project {
        logger.info(`Create new project`, parameters);

        const params = Utils.withDefaultValues(parameters, {name: 'New project'});
        this.currentProject = new Project(params.name);

        this.sendProjectEvent({
            type: EventType.PROJECT_NEW_CREATED,
            data: this.currentProject,
        });

        return this.currentProject;
    }

    public addLayer(layer: AbstractMapLayer) {
        logger.info(`Adding layer: ${JSON.stringify(layer)}`);

        if (!layer.id) {
            layer.generateId();
        }

        this.currentProject.layers.push(layer);

        this.sendProjectEvent({
            type: EventType.PROJECT_NEW_LAYER_ADDED,
            data: this.currentProject
        });
    }

    public addLayers(layers: any[]) {
        _.forEach(layers, (lay) => { // TODO: avoid sending too much events ?
            this.addLayer(lay);
        });
    }

    public getCurrentProject(): Project {
        return this.currentProject;
    }

    public deleteLayers(layerIds: string[]) {
        logger.info(`Deleting layers: ${layerIds}`);

        _.remove(this.currentProject.layers, (lay: AbstractMapLayer) => {
            return layerIds.indexOf(lay.id) !== -1;
        });

        this.sendProjectEvent({
            type: EventType.PROJECT_UPDATED,
            data: this.currentProject
        });

    }

    private sendProjectEvent(data: IpcEvent) {
        return this.ipc.send(IpcSubject.PROJECT_EVENTS_BUS, data);
    }

}