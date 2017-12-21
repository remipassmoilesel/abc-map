import {Actions, Mutations} from './mutationsAndActions';
import {Clients} from '../../clients/Clients';
import {Logger} from '../../../../api/dev/Logger';
import {Project} from '../../../../api/entities/Project';
import {ProjectPayload} from './payloads';

const logger = Logger.getLogger('ProjectStoreModule');
const clients = new Clients();

export class ProjectState {
    public currentProject: Project = null;
}

export class ProjectStoreModule {

    public state = new ProjectState();

    // Warning: all mutations must be synchronous !
    public mutations = {
        [Mutations.PROJECT_UPDATE]: (state: ProjectState, payload: ProjectPayload) => {
            state.currentProject = payload.project;
        },
    };

    public actions = {
        [Actions.PROJECT_UPDATE]: (context) => {
            logger.info(`Dispatching action ${Actions.PROJECT_UPDATE}`);
            clients.project.getCurrentProject().then((project) => {
                context.commit(Mutations.PROJECT_UPDATE, {project});
            });
        },
    };

    public getters = {
        projectName: (state: ProjectState) => {
            if (state.currentProject) {
                return state.currentProject.name;
            } else {
                return 'No current project';
            }
        },
        projectLayers: (state: ProjectState) => {
            if (state.currentProject) {
                return state.currentProject.layers;
            } else {
                return [];
            }
        },
    };

}
