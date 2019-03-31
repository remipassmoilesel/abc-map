import Vue from 'vue';
import Vuex from 'vuex';
import {IProjectState, projectModule} from "@/lib/store/ProjectStoreModule";

Vue.use(Vuex);

export interface IRootState {
    title: string; // for example only
    project: IProjectState
}

export const mainStore = new Vuex.Store<IRootState>({
    state: {
        title: "Abc-map",
        project: null as any, // module
    },
    mutations: {

    },
    actions: {

    },
    modules: {
        project: projectModule,
    }
});
