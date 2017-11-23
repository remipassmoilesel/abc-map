import { Ipc, IpcSubjects } from '../../../api/utils/Ipc';
import { WmsLayer } from '../../../api/entities/WmsLayer';

export class MapClient {

    private ipc: Ipc;

    constructor() {
        this.ipc = new Ipc();
    }

    public getWmsUrls(): Promise<WmsLayer[]> {
        return this.ipc.send(IpcSubjects.MAP_GET_WMS_URLS);
    }

}
