import {Actions, Mutations} from "./mutationsAndActions";
import {Clients} from "../clients/Clients";
import {Logger} from "../../../api/dev/Logger";
import {MapView} from "../../components/map/MapView";

const logger = Logger.getLogger('ProjectStoreModule');
const clients = new Clients();

export class MapState {
    public currentMapView: MapView = null;
}

export class MapStoreModule {

    state = new MapState();

    // Warning: all mutations must be synchronous !
    mutations = {
        [Mutations.MAP_VIEW_UPDATE]: (state: MapState, payload: any) => {
            state.currentMapView = payload.view;
        }
    };

    actions = {
        [Actions.MAP_VIEW_UPDATE]: (context, payload: any) => {
            logger.info(`Dispatching action ${Actions.MAP_VIEW_UPDATE}`);
            context.commit(Mutations.MAP_VIEW_UPDATE, payload);
        }
    };

    getters = {
        mapView: (state: MapState) => {
            return state.currentMapView
        }
    };

}
