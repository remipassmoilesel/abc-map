import Vue from 'vue';
import Vuex, {Store} from 'vuex';
import {Logger} from '../../../api/dev/Logger';
import {ProjectState, ProjectStoreModule} from "./ProjectStoreModule";
import {MapState, MapStoreModule} from "./MapStoreModule";
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import {MapView} from "../map/MapView";


const logger = Logger.getLogger('store.ts');
logger.info('Initializing Vuex store');

Vue.use(Vuex);

// Create a main vuex store
export const store = new Vuex.Store({
    modules: {
        project: new ProjectStoreModule(),
        map: new MapStoreModule()
    }
});

// Type classes
export class MainStore extends Store<any> {
    public state: MainStoreState;
    public getters: MainStoreGetters;
}

export class MainStoreState {
    project: ProjectState;
    map: MapState;
}

export class MainStoreGetters {
    public projectName: String;
    public projectLayers: AbstractMapLayer[];
    public currentMapView: MapView;
}