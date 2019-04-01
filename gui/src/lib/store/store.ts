import Vue from 'vue';
import Vuex from 'vuex';
import {IProjectState, abcProjectStoreModule} from "@/lib/store/AbcProjectStoreModule";
import {abcGuiModule, IGuiState} from "@/lib/store/AbcGuiStoreModule";

Vue.use(Vuex);

export interface IRootState {
    title: string; // for example only
    project: IProjectState,
    gui: IGuiState
}

export const mainStore = new Vuex.Store<IRootState>({
    state: {
        title: "Abc-map",
        project: null as any, // module
        gui: null as any, // module
    },
    mutations: {

    },
    actions: {

    },
    modules: {
        project: abcProjectStoreModule,
        gui: abcGuiModule,
    }
});
