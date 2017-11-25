import Vue from 'vue';
import Vuex, {Store} from 'vuex';
import {Logger} from '../../../api/dev/Logger';
import {ProjectState, ProjectStoreModule} from "./ProjectStoreModule";


const logger = Logger.getLogger('store.ts');
logger.info('Initializing Vuex store');

Vue.use(Vuex);

// Create a main vuex store
export const store = new Vuex.Store({
    modules: {
        project: new ProjectStoreModule()
    }
});

// Type classes
export class MainStore extends Store<any> {
    public state: MainStoreState;
}

export class MainStoreState {
    project: ProjectState;
}