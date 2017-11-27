import {Project} from "../entities/Project";
import {Logger} from "../dev/Logger";
import {Utils} from "../utils/Utils";
import {Ipc} from "../ipc/Ipc";
import {Subj} from "../ipc/IpcSubjects";
import {Evt} from "../ipc/IpcEventTypes";
import {IpcEvent} from "../ipc/IpcEvent";
import {AbstractService} from "./AbstractService";
import {AbstractMapLayer} from "../entities/AbstractMapLayer";

const logger = Logger.getLogger('ProjectService');


export class ProjectService extends AbstractService {

    private currentProject: Project;

    constructor(ipc: Ipc) {
        super(ipc);
        logger.info('Initialize project service');
    }

    public newProject(parameters?: any) {
        logger.info(`Create new project`, parameters);

        const params = Utils.withDefaultValues(parameters, {name: 'New project'});
        this.currentProject = new Project(params.name);

        this.sendProjectEvent({
            type: Evt.PROJECT_NEW_CREATED,
            data: this.currentProject,
        });
    }

    public addLayer(layer: AbstractMapLayer) {
        logger.info(`Adding layer: ${JSON.stringify(layer)}`);

        this.currentProject.layers.push(layer);

        this.sendProjectEvent({
            type: Evt.PROJECT_NEW_LAYER_ADDED,
            data: this.currentProject
        });
    }

    public getCurrentProject(): Project {
        return this.currentProject;
    }

    private sendProjectEvent(data: IpcEvent) {
        return this.ipc.send(Subj.PROJECT_EVENTS_BUS, data);
    }

}