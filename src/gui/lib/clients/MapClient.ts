import { Ipc, IpcSubjects } from '../../../api/utils/Ipc';
import { WmsLayer } from '../../../api/entities/WmsLayer';
import { EntitiesUtils } from '../../../api/utils/EntitiesUtils';

export class MapClient {

    private ipc: Ipc;

    constructor() {
        this.ipc = new Ipc();
    }

    public getWmsUrls(): Promise<WmsLayer[]> {
        return this.ipc.send(IpcSubjects.MAP_GET_WMS_URLS).then((rawLayers) => {
            return EntitiesUtils.parseFromRawArray(WmsLayer.prototype, rawLayers);
        });
    }

}
