import {Project} from "../entities/Project";
import {Logger} from "../dev/Logger";
import {Utils} from "../utils/Utils";
import {Ipc} from "../ipc/Ipc";
import {Subj} from "../ipc/IpcSubjects";
import {Evt} from "../ipc/IpcEventTypes";
import {IpcEvent} from "../ipc/IpcEvent";
import {AbstractService} from "./AbstractService";

export class ProjectService extends AbstractService{

    private logger = Logger.getLogger('MapService');
    private currentProject: Project;

    constructor(ipc: Ipc) {
        super(ipc);
        this.logger.info('Initialize project service');
    }

    public newProject(parameters?: any) {
        this.logger.info(`New project created`, parameters);
        const params = Utils.withDefaultValues(parameters, {name: 'New project'});
        this.currentProject = new Project(params.name);

        this.sendProjectEvent({
            type: Evt.PROJECT_NEW_CREATED,
            data: this.currentProject,
        });
    };

    public getCurrentProject(): Project {
        return this.currentProject;
    }

    private sendProjectEvent(data: IpcEvent) {
        return this.ipc.send(Subj.PROJECT_EVENTS_BUS, data);
    }

}