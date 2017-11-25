import { Ipc} from '../../../api/ipc/Ipc';
import { WmsLayer } from '../../../api/entities/WmsLayer';
import { EntitiesUtils } from '../../../api/utils/EntitiesUtils';
import {Subj} from "../../../api/ipc/IpcSubjects";

export class MapClient {

    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public getWmsUrls(): Promise<WmsLayer[]> {
        return this.ipc.send(Subj.MAP_GET_WMS_DEFAULT_LAYERS).then((rawLayers) => {
            return EntitiesUtils.parseFromRawArray(WmsLayer.prototype, rawLayers);
        });
    }

}
