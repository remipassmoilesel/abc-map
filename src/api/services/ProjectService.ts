import {Project} from "../entities/Project";
import {Logger} from "../dev/Logger";
import {Utils} from "../utils/Utils";

export class ProjectService {

    private logger = Logger.getLogger('MapService');
    private _currentProject: Project;

    constructor() {
        this.logger.info('Initialize project service');
    }

    public newProject(parameters?: any) {
        this.logger.info(`New project created`, parameters);
        Utils.withDefaultValues(parameters, {name: 'New project'});

        this._currentProject = new Project(parameters.name);
    }

    public getCurrentProject(): Project {
        return this._currentProject;
    }

}