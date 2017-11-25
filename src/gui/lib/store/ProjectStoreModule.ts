import {Ats, Mts} from "./mutationsAndActions";
import {ProjectClient} from "../clients/ProjectClient";
import {Logger} from "../../../api/dev/Logger";
import {Project} from "../../../api/entities/Project";

const logger = Logger.getLogger('ProjectStoreModule');
const projectClient = new ProjectClient();

export class ProjectState {
    public currentProject: Project = null;
}

export class ProjectStoreModule {

    state = new ProjectState();

    // Warning: all mutations must be synchronous !
    mutations = {
        [Mts.PROJECT_UPDATE]: (state, payload: any) => {
            state.currentProject = payload.project;
        }
    };

    actions = {
        [Ats.PROJECT_UPDATE]: (context) => {
            logger.info(`Dispatching action ${Ats.PROJECT_UPDATE}`);
            projectClient.getCurrentProject().then((project) => {
                context.commit(Mts.PROJECT_UPDATE, {project});
            });
        }
    };

    getters = {};

}
