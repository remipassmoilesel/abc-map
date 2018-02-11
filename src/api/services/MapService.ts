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
import {GeoJsonLayer} from '../entities/layers/GeoJsonLayer';
import * as path from 'path';
import {AbstractMapLayer} from '../entities/layers/AbstractMapLayer';
import {LayerEditor} from '../layer-editor/LayerEditor';
import {IServicesMap} from './IServiceMap';
import {FileFormat} from '../export/FileFormat';

const logger = Logger.getLogger('MapService');

export class MapService extends AbstractService {

    private defaultLayers: DefaultTileLayers;
    private dataImporterFinder: DataImporterFinder;
    private geocoder: NominatimGeocoder;
    private layerEditor: LayerEditor;

    constructor(ipc: Ipc) {
        super(ipc);

        logger.info('Initialize MapService');

        this.defaultLayers = new DefaultTileLayers();
        this.geocoder = new NominatimGeocoder();
    }

    public setServicesMap(services: IServicesMap) {
        super.setServicesMap(services);
        this.layerEditor = new LayerEditor(services);
        this.dataImporterFinder = new DataImporterFinder(services);
    }

    public geocode(query: string): Promise<GeocodingResult[]> {
        return (this.geocoder.geocode(query) as any);
    }

    public getDefaultWmsLayers(): TileLayer[] {
        return this.defaultLayers.getLayers();
    }

    public async importFiles(files: string[], collectionName?: string): Promise<string[]> {

        const importedCollectionIds = [];
        for (const file of files) {
            const importer = this.dataImporterFinder.getInstanceForFile(file);
            if (!importer) {
                throw new Error(`Unsupported file: ${JSON.stringify(file)}`);
            }
            const collectionId: string = await importer.fileToCollection(file, collectionName);
            importedCollectionIds.push(collectionId);
        }

        return importedCollectionIds;
    }

    public async importFilesAsLayers(filePaths: string[],
                                     layerIds: string[] = []): Promise<AbstractMapLayer[]> {

        const layers: AbstractMapLayer[] = [];

        try {
            let i = 0;
            for (const fPath of filePaths) {

                const layerName = layerIds[i] ? layerIds[i] : path.basename(fPath);
                const layer = new GeoJsonLayer(layerName);
                layer.id = layerIds[i] ? layerIds[i] : layer.id;

                await this.services.map.importFiles([fPath], layer.id);

                layers.push(layer);

                i++;
            }

            await this.services.project.addLayers(layers);

            return layers;
        } catch (e) {
            logger.error(`Error while importing data: ${e}`);
            throw e;
        }

    }

    public async editLayerAsSpreadsheet(layerId: string, exportFormat?: FileFormat) {

        // check if layer is already edited
        if (this.layerEditor.isEdited(layerId)) {
            throw new Error('Layer is already edited');
        }

        await this.layerEditor.edit(layerId, exportFormat || FileFormat.XLSX);

    }

    public onAppExit(): Promise<void> {
        return Promise.resolve();
    }

    private sendMapEvent(data: IpcEvent) {
        return this.ipc.send(IpcEventBus.MAP, data);
    }

}
