import {Logger} from '../dev/Logger';
import {DefaultTileLayers} from '../entities/DefaultTileLayers';
import {TileLayer} from '../entities/layers/TileLayer';
import {AbstractService} from "./AbstractService";
import {Ipc} from "../ipc/Ipc";
import {ProjectService} from "./ProjectService";
import {AbstractMapLayer} from "../entities/layers/AbstractMapLayer";
import {IpcEvent} from "../ipc/IpcEvent";
import {IpcSubjects} from "../ipc/IpcSubjects";
import {EventType} from "../ipc/IpcEventTypes";
import {KmlDataImporter} from "../import/KmlDataImporter";

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

    public kmlFileToGeoJsonLayer(pathToSourceFile: string): Promise<AbstractMapLayer>{
        return new KmlDataImporter().getAsLayer(pathToSourceFile);
    }

    private sendMapEvent(data: IpcEvent) {
        return this.ipc.send(IpcSubjects.MAP_EVENTS_BUS, data);
    }
}
