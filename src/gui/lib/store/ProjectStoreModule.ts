import {Actions, Mutations} from "./mutationsAndActions";
import {Clients} from "../clients/Clients";
import {Logger} from "../../../api/dev/Logger";
import {Project} from "../../../api/entities/Project";

const logger = Logger.getLogger('ProjectStoreModule');
const clients = new Clients();

export class ProjectState {
    public currentProject: Project = null;
}

export class ProjectStoreModule {

    state = new ProjectState();

    // Warning: all mutations must be synchronous !
    mutations = {
        [Mutations.PROJECT_UPDATE]: (state: ProjectState, payload: any) => {
            state.currentProject = payload.project;
        }
    };

    actions = {
        [Actions.PROJECT_UPDATE]: (context) => {
            logger.info(`Dispatching action ${Actions.PROJECT_UPDATE}`);
            clients.project.getCurrentProject().then((project) => {
                context.commit(Mutations.PROJECT_UPDATE, {project});
            });
        }
    };

    getters = {
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
        }
    };

}
