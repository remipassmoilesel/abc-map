import {Ipc} from "../ipc/Ipc";
import {IpcSubjects} from "../ipc/IpcSubjects";
import {IpcEvent} from "../ipc/IpcEvent";
import {AbstractMapLayer} from "../entities/layers/AbstractMapLayer";
import {AbstractHandlersGroup, IServicesMap} from "./AbstractHandlersGroup";

export class MapHandlers extends AbstractHandlersGroup {

    public init(ipc: Ipc, services: IServicesMap) {

        ipc.listen(IpcSubjects.MAP_GET_WMS_DEFAULT_LAYERS, () => {
            return services.map.getDefaultWmsLayers();
        });

        ipc.listen(IpcSubjects.MAP_IMPORT_FILES, (event: IpcEvent) => {
            // TODO: guess format from extension
            return services.map.kmlFileToGeoJsonLayer(event.data).then((layer: AbstractMapLayer) => {
                services.project.addLayer(layer);
            });
        });
    }

}
