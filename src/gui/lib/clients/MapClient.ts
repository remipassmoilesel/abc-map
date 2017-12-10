import {Ipc, IpcHandler} from '../../../api/ipc/Ipc';
import {TileLayer} from '../../../api/entities/layers/TileLayer';
import {DbSubjects, IpcEventBus, MapSubjects} from "../../../api/ipc/IpcSubject";
import {handleRejection} from "./clientUtils";
import {GeocodingResult} from "../../../api/entities/GeocodingResult";
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";

export class MapClient {

    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public onMapEvent(handler: IpcHandler): void {
        return this.ipc.listen(IpcEventBus.MAP, handler);
    }

    public getDefaultWmsLayers(): Promise<TileLayer[]> {
        return this.ipc.send(MapSubjects.GET_WMS_DEFAULT_LAYERS).catch(handleRejection);
    }

    public importFiles(files: String[]) {
        return this.ipc.send(MapSubjects.IMPORT_FILES, {data: files}).catch(handleRejection);
    }

    public geocode(query: string): Promise<GeocodingResult[]> {
        return this.ipc.send(MapSubjects.GEOCODE, {data: query}).catch(handleRejection);
    }

    public getGeojsonDataForLayer(layer: AbstractMapLayer): Promise<L.Layer> {
        return this.ipc.send(DbSubjects.GET_LAYER_GEOJSON_DATA, {data: layer.id});
    }
}
