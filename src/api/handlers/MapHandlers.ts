import {Ipc} from "../ipc/Ipc";
import {IpcSubject} from "../ipc/IpcSubject";
import {IpcEvent} from "../ipc/IpcEvent";
import {AbstractHandlersGroup, IServicesMap} from "./AbstractHandlersGroup";

export class MapHandlers extends AbstractHandlersGroup {

    constructor(ipc: Ipc, services: IServicesMap) {
        super(ipc, services);

        this.registerHandler(IpcSubject.MAP_GET_WMS_DEFAULT_LAYERS, this.getDefaultWmsLayers);
        this.registerHandler(IpcSubject.MAP_IMPORT_FILES, this.importDataFiles);
    }

    public getDefaultWmsLayers() {
        return this.services.map.getDefaultWmsLayers();
    }

    public importDataFiles(event: IpcEvent) {
        this.services.map.importFilesAsLayers(event.data).then((layers) => {
            this.services.project.addLayers(layers);
        });
    }

}
