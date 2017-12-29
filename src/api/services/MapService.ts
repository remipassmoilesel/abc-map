import * as _ from 'lodash';
import {Logger} from '../dev/Logger';
import {DefaultTileLayers} from '../entities/layers/DefaultTileLayers';
import {TileLayer} from '../entities/layers/TileLayer';
import {AbstractService} from './AbstractService';
import {Ipc} from '../ipc/Ipc';
import {IpcEvent} from '../ipc/IpcEvent';
import {IpcEventBus} from '../ipc/IpcSubject';
import {DataImporterFinder} from '../import/DataImporterFinder';
import {NominatimGeocoder} from '../geocoder/NominatimGeocoder';
import {GeocodingResult} from '../entities/GeocodingResult';
import {IImportedFile} from '../import/AbstractDataImporter';
import {GeoJsonLayer} from '../entities/layers/GeoJsonLayer';
import * as path from 'path';
import {AbstractMapLayer} from '../entities/layers/AbstractMapLayer';

const logger = Logger.getLogger('MapService');

export class MapService extends AbstractService {

    private defaultLayers: DefaultTileLayers;
    private dataImporterFinder: DataImporterFinder;
    private geocoder: NominatimGeocoder;

    constructor(ipc: Ipc) {
        super(ipc);

        logger.info('Initialize MapService');

        this.defaultLayers = new DefaultTileLayers();
        this.dataImporterFinder = new DataImporterFinder();
        this.geocoder = new NominatimGeocoder();
    }

    public geocode(query: string): Promise<GeocodingResult[]> {
        return (this.geocoder.geocode(query) as any);
    }

    public getDefaultWmsLayers(): TileLayer[] {
        return this.defaultLayers.getLayers();
    }

    public importFiles(files: string[]): Promise<IImportedFile[]> {
        const promises: Array<Promise<IImportedFile>> = [];

        _.forEach(files, (file: string) => {

            const importer = this.dataImporterFinder.getInstanceForFile(file);
            if (!importer) {
                throw new Error(`Unsupported file: ${JSON.stringify(file)}`);
            }

            const p: Promise<IImportedFile> = importer.getGeoJson(file);
            promises.push(p);
        });

        return Promise.all(promises);
    }


    public async importFilesAsLayers(filePaths: string[]) {

        const importedFiles = await this.services.map.importFiles(filePaths);

        const layers: AbstractMapLayer[] = [];
        const dao = this.services.db.getGeoJsonDao();

        try {
            for (const f of importedFiles) {
                const layer = new GeoJsonLayer();
                layer.name = path.basename(f.filepath);
                await dao.saveLayer(layer, f.data.features);
                layers.push(layer);
            }

            await this.services.project.addLayers(layers);

        } catch (e) {
            logger.error(`Error while importing data: ${e}`);
            throw e;
        }
    }

    public onAppExit(): Promise<void> {
        return Promise.resolve();
    }

    private sendMapEvent(data: IpcEvent) {
        return this.ipc.send(IpcEventBus.MAP, data);
    }


}
