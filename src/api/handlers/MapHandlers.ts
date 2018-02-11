import {Ipc} from '../ipc/Ipc';
import {MapSubjects} from '../ipc/IpcSubject';
import {IpcEvent} from '../ipc/IpcEvent';
import {AbstractHandlersGroup} from './AbstractHandlersGroup';
import {GeocodingResult} from '../entities/GeocodingResult';
import {Logger} from '../dev/Logger';
import {IServicesMap} from '../services/IServiceMap';
import {AbstractMapLayer} from '../entities/layers/AbstractMapLayer';
import {TileLayer} from '../entities/layers/TileLayer';

const logger = Logger.getLogger('MapHandlers');

export class MapHandlers extends AbstractHandlersGroup {

    constructor(ipc: Ipc, services: IServicesMap) {
        super(ipc, services);

        this.registerHandler(MapSubjects.GET_WMS_DEFAULT_LAYERS, this.getDefaultWmsLayers.bind(this));
        this.registerHandler(MapSubjects.IMPORT_FILES, this.importDataFiles.bind(this));
        this.registerHandler(MapSubjects.GEOCODE, this.geocode.bind(this));
        this.registerHandler(MapSubjects.EDIT_LAYER_AS_SPREADSHEET, this.editLayerAsSpreadsheet.bind(this));
    }

    public getDefaultWmsLayers(): TileLayer[] {
        return this.services.map.getDefaultWmsLayers();
    }

    public async importDataFiles(event: IpcEvent): Promise<AbstractMapLayer[]> {
        return await this.services.map.importFilesAsLayers(event.data);
    }

    public geocode(ev: IpcEvent): Promise<GeocodingResult[]> {
        return this.services.map.geocode(ev.data);
    }

    public editLayerAsSpreadsheet(ev: IpcEvent): Promise<void> {
        return this.services.map.editLayerAsSpreadsheet(ev.data.layerId, ev.data.exportFormat);
    }

    public onAppExit(): Promise<void> {
        return Promise.resolve();
    }

}
