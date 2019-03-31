import {IProject} from "../../../../shared/dist";
import {Module, ModuleTree} from "vuex";
import {IRootState} from "@/lib/store/store";
import {services} from "@/lib/ServiceMap";

export enum ProjectMutations {
    PROJECT_UPDATE = 'PROJECT_UPDATE'
}

export enum ProjectActions {
    PROJECT_UPDATE = 'PROJECT_UPDATE'
}

export const projectModule: Module<IProjectState, IRootState> = {
    state: {
        currentProject: null,
    },
    getters: {
        currentProject: (state, getters, rootState, rootGetters) => {
            return state.currentProject;
        },
        projectName: (state: IProjectState) => {
            if (state.currentProject) {
                return state.currentProject.name;
            } else {
                return 'No current project';
            }
        },
        projectLayers: (state: IProjectState) => {
            if (state.currentProject) {
                return state.currentProject.layers;
            } else {
                return [];
            }
        }
    },
    actions: {
        [ProjectActions.PROJECT_UPDATE]: (context: any) => {
            services.project.findProjectById("fake-project-id").then(project => {
                context.commit(ProjectMutations.PROJECT_UPDATE, {project});
            })
        },
    },
    mutations: {
        [ProjectMutations.PROJECT_UPDATE]: (state: IProjectState, payload: {project: IProject}) => {
            state.currentProject = payload.project;
        },
    },
};

export interface IProjectState {
    currentProject: IProject | null;
}
