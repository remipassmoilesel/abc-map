import {MainStore} from './store';
import {Actions} from './modules/mutationsAndActions';
import {IMapViewPayload} from './modules/payloads';
import {Project} from '../../../api/entities/Project';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';

export class StoreWrapper {
    public map = new MapStoreWrapper();
    public project = new ProjectStoreWrapper();
    public gui = new GuiStoreWrapper();
}

export class ProjectStoreWrapper {

    public updateProject($store: MainStore): Promise<void> {
        return $store.dispatch(Actions.PROJECT_UPDATE);
    }

    public getCurrentProject($store: MainStore): Project | null {
        return $store.state.project.currentProject;
    }

    public getProjectLayers($store: MainStore): AbstractMapLayer[] {
        return $store.getters.projectLayers;
    }

    public getProjectName($store: MainStore): string {
        return $store.getters.projectName;
    }

}

export class MapStoreWrapper {

    public updateMapView($store: MainStore, payload: IMapViewPayload) {
        $store.dispatch(Actions.MAP_VIEW_UPDATE, payload);
    }

    public getMapView($store: MainStore) {
        return $store.getters.currentMapView;
    }
}

export class GuiStoreWrapper {

    public setActionDialogVisible($store: MainStore, visible: boolean) {
        $store.dispatch(Actions.ACTION_DIALOG, {dialogIsVisible: visible});
    }

    public isActionDialogVisible($store: MainStore) {
        return $store.state.gui.actionDialogVisible;
    }

}
