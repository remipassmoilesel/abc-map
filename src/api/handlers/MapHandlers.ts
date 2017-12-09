import * as _ from "lodash";
import * as path from "path";
import {Ipc} from "../ipc/Ipc";
import {IpcSubject} from "../ipc/IpcSubject";
import {IpcEvent} from "../ipc/IpcEvent";
import {AbstractHandlersGroup, IServicesMap} from "./AbstractHandlersGroup";
import {GeocodingResult} from "../entities/GeocodingResult";
import {GeoJsonLayer} from "../entities/layers/GeoJsonLayer";
import {AbstractMapLayer} from "../entities/layers/AbstractMapLayer";
import {Logger} from "../dev/Logger";

const logger = Logger.getLogger('MapHandlers');

export class MapHandlers extends AbstractHandlersGroup {

    constructor(ipc: Ipc, services: IServicesMap) {
        super(ipc, services);

        this.registerHandler(IpcSubject.MAP_GET_WMS_DEFAULT_LAYERS, this.getDefaultWmsLayers.bind(this));
        this.registerHandler(IpcSubject.MAP_IMPORT_FILES, this.importDataFiles.bind(this));
        this.registerHandler(IpcSubject.MAP_GEOCODE, this.geocode.bind(this));
    }

    public getDefaultWmsLayers() {
        return this.services.map.getDefaultWmsLayers();
    }

    public importDataFiles(event: IpcEvent): void {
        this.services.map.importFiles(event.data).then((importedFiles) => {

            const layers: AbstractMapLayer[] = [];
            const dao = this.services.db.getGeoJsonDao();
            const promises: Promise<any>[] = [];

            _.forEach(importedFiles, (f) => {

                const layer = new GeoJsonLayer();
                layer.name = path.basename(f.filepath);
                promises.push(dao.saveLayer(layer, f.data.features));
                layers.push(layer);

            });

            return Promise.all(promises)
                .then(() => {
                    this.services.project.addLayers(layers);
                })
                .catch((e) => {
                    logger.error(`Error while importing data: ${e}`);
                    throw e;
                })
        });
    }

    public geocode(ev: IpcEvent): Promise<GeocodingResult[]> {
        return this.services.map.geocode(ev.data);
    }
}
