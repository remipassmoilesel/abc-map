import {Ipc, IpcHandler} from '../../../api/ipc/Ipc';
import {TileLayer} from '../../../api/entities/layers/TileLayer';
import {EntitySerializer} from '../../../api/entities/EntitySerializer';
import {IpcSubject} from "../../../api/ipc/IpcSubject";
import {handleRejection} from "./clientUtils";
import {GeocodingResult} from "../../../api/entities/GeocodingResult";
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";

const eu = new EntitySerializer();

export class MapClient {

    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public onMapEvent(handler: IpcHandler): void {
        return this.ipc.listen(IpcSubject.MAP_EVENTS_BUS, handler);
    }

    public getDefaultWmsLayers(): Promise<TileLayer[]> {
        return this.ipc.send(IpcSubject.MAP_GET_WMS_DEFAULT_LAYERS).catch(handleRejection);
    }

    public importFiles(files: String[]) {
        return this.ipc.send(IpcSubject.MAP_IMPORT_FILES, {data: files}).catch(handleRejection);
    }

    public geocode(query: string): Promise<GeocodingResult[]> {
        return this.ipc.send(IpcSubject.MAP_GEOCODE, {data: query}).catch(handleRejection);
    }

    public getGeojsonDataForLayer(layer: AbstractMapLayer): Promise<L.Layer> {
        return this.ipc.send(IpcSubject.DB_GET_LAYER_GEOJSON_DATA, {data: layer.id});
    }
}
