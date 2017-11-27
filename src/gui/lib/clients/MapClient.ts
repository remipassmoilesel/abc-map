import {Ipc, IpcHandler} from '../../../api/ipc/Ipc';
import {TileLayer} from '../../../api/entities/TileLayer';
import {EntitiesUtils} from '../../../api/utils/EntitiesUtils';
import {Subj} from "../../../api/ipc/IpcSubjects";
import {handleRejection} from "./clientUtils";

const eu = new EntitiesUtils();

export class MapClient {

    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public onMapEvent(handler: IpcHandler): void {
        return this.ipc.listen(Subj.MAP_EVENTS_BUS, handler);
    }

    public getDefaultWmsLayers(): Promise<TileLayer[]> {
        return this.ipc.send(Subj.MAP_GET_WMS_DEFAULT_LAYERS).catch(handleRejection);
    }

}
