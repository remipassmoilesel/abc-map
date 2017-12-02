import * as _ from 'lodash';
import {Logger} from '../dev/Logger';
import {DefaultTileLayers} from '../entities/DefaultTileLayers';
import {TileLayer} from '../entities/layers/TileLayer';
import {AbstractService} from "./AbstractService";
import {Ipc} from "../ipc/Ipc";
import {IpcEvent} from "../ipc/IpcEvent";
import {IpcSubject} from "../ipc/IpcSubject";
import * as Promise from 'bluebird';
import {DataImporterFinder} from "../import/DataImporterFinder";
import {NominatimGeocoder} from "../geocoder/NominatimGeocoder";
import {GeocodingResult} from "../entities/GeocodingResult";

const logger = Logger.getLogger('MapService');

export class MapService extends AbstractService {

    private defaultLayers: DefaultTileLayers;
    private dataImporterFinder: DataImporterFinder;
    private geocoder: NominatimGeocoder;

    constructor(ipc: Ipc) {
        super(ipc);

        logger.info('Init MapService');

        this.defaultLayers = new DefaultTileLayers();
        this.dataImporterFinder = new DataImporterFinder();
        this.geocoder = new NominatimGeocoder();
    }

    public geocode(query: string): Promise<GeocodingResult[]>{
        return this.geocoder.geocode(query);
    }

    public getDefaultWmsLayers(): TileLayer[] {
        return this.defaultLayers.layers;
    }

    public importFilesAsLayers(files: string[]) {
        const promises: any = [];
        _.forEach(files, (file: string) => {
            const importer = this.dataImporterFinder.getInstanceForFile(file);
            if (!importer) {
                throw new Error(`Unsupported file: ${JSON.stringify(file)}`)
            }

            const p = importer.getAsLayer(file);
            promises.push(p);
        });
        return Promise.all(promises);
    }

    private sendMapEvent(data: IpcEvent) {
        return this.ipc.send(IpcSubject.MAP_EVENTS_BUS, data);
    }


}
