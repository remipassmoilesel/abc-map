import Vue from 'vue';
import Vuex, {Store} from 'vuex';
import {Logger} from '../../../api/dev/Logger';
import {ProjectState, ProjectStoreModule} from './modules/ProjectStoreModule';
import {MapState, MapStoreModule} from './modules/MapStoreModule';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';
import {MapView} from '../map/MapView';
import {GuiState, GuiStoreModule} from './modules/GuiStoreModule';

const logger = Logger.getLogger('store.ts');
logger.info('Initializing Vuex store');

Vue.use(Vuex);

// Create a main vuex store
export const store = new Vuex.Store({
    modules: {
        gui: new GuiStoreModule(),
        map: new MapStoreModule(),
        project: new ProjectStoreModule(),
    },
});

// Type classes
export class MainStore extends Store<any> {
    public state: MainStoreState;
    public getters: MainStoreGetters;
}

export class MainStoreState {
    public project: ProjectState;
    public map: MapState;
    public gui: GuiState;
}

export class MainStoreGetters {
    public projectName: string;
    public projectLayers: AbstractMapLayer[];
    public currentMapView: MapView;
}
