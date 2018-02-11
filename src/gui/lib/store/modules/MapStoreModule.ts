import {Actions, Mutations} from './mutationsAndActions';
import {ClientGroup} from '../../clients/ClientGroup';
import {Logger} from '../../../../api/dev/Logger';
import {MapView} from '../../map/MapView';
import {IMapViewPayload} from './payloads';

const logger = Logger.getLogger('MapStoreModule');
const clients = new ClientGroup();

// /!\ All variables must be initialized
export class MapState {
    public currentMapView: MapView;
}

export class MapStoreModule {

    public state = new MapState();

    // Warning: all mutations must be synchronous !
    public mutations = {
        [Mutations.MAP_VIEW_UPDATE]: (state: MapState, payload: IMapViewPayload) => {
            logger.info(`Committing mutation ${Mutations.MAP_VIEW_UPDATE}`);
            state.currentMapView = payload.view;
        },
    };

    public actions = {
        [Actions.MAP_VIEW_UPDATE]: (context: any, payload: IMapViewPayload) => {
            logger.info(`Dispatching action ${Actions.MAP_VIEW_UPDATE}`);
            context.commit(Mutations.MAP_VIEW_UPDATE, payload);
        },
    };

    public getters = {
        currentMapView: (state: MapState) => {
            return state.currentMapView;
        },
    };

}

