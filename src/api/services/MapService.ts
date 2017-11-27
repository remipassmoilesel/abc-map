import {Logger} from '../dev/Logger';
import {DefaultTileLayers} from '../entities/DefaultTileLayers';
import {TileLayer} from '../entities/TileLayer';
import {AbstractService} from "./AbstractService";
import {Ipc} from "../ipc/Ipc";
import {ProjectService} from "./ProjectService";
import {AbstractMapLayer} from "../entities/AbstractMapLayer";
import {IpcEvent} from "../ipc/IpcEvent";
import {Subj} from "../ipc/IpcSubjects";
import {Evt} from "../ipc/IpcEventTypes";

const logger = Logger.getLogger('MapService');

export class MapService extends AbstractService {

    private defaultLayers: DefaultTileLayers;

    constructor(ipc: Ipc) {
        super(ipc);

        logger.info('Init MapService');

        this.defaultLayers = new DefaultTileLayers();
    }

    public getDefaultWmsLayers(): TileLayer[] {
        return this.defaultLayers.layers;
    }

    private sendMapEvent(data: IpcEvent) {
        return this.ipc.send(Subj.MAP_EVENTS_BUS, data);
    }
}
