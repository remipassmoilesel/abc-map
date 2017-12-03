import {MainStore} from "./store";
import {Actions} from "./modules/mutationsAndActions";
import {MapViewPayload} from "./modules/payloads";


export class StoreWrapper {

    public map = new MapStoreWrapper();
    public project = new ProjectStoreWrapper();
}

export class ProjectStoreWrapper {

    public updateProject($store: MainStore) {
        $store.dispatch(Actions.PROJECT_UPDATE);
    }

    public getCurrentProject($store: MainStore) {
        return $store.state.project.currentProject;
    }

    public getProjectLayers($store: MainStore) {
        return $store.getters.projectLayers;
    }

    public getProjectName($store: MainStore) {
        return $store.getters.projectName;
    }

}

export class MapStoreWrapper {

    public updateMapView($store: MainStore, payload: MapViewPayload) {
        $store.dispatch(Actions.MAP_VIEW_UPDATE, payload);
    }

    public getMapView($store: MainStore) {
        return $store.getters.currentMapView;
    }
}