import {Ipc} from '../ipc/Ipc';
import {MapSubjects} from '../ipc/IpcSubject';
import {IpcEvent} from '../ipc/IpcEvent';
import {AbstractHandlersGroup, IServicesMap} from './AbstractHandlersGroup';
import {GeocodingResult} from '../entities/GeocodingResult';
import {Logger} from '../dev/Logger';

const logger = Logger.getLogger('MapHandlers');

export class MapHandlers extends AbstractHandlersGroup {

    constructor(ipc: Ipc, services: IServicesMap) {
        super(ipc, services);

        this.registerHandler(MapSubjects.GET_WMS_DEFAULT_LAYERS, this.getDefaultWmsLayers.bind(this));
        this.registerHandler(MapSubjects.IMPORT_FILES, this.importDataFiles.bind(this));
        this.registerHandler(MapSubjects.GEOCODE, this.geocode.bind(this));
    }

    public getDefaultWmsLayers() {
        return this.services.map.getDefaultWmsLayers();
    }

    public async importDataFiles(event: IpcEvent): Promise<void> {
        return await this.services.map.importFilesAsLayers(event.data);
    }

    public geocode(ev: IpcEvent): Promise<GeocodingResult[]> {
        return this.services.map.geocode(ev.data);
    }

    public onAppExit(): Promise<void> {
        return Promise.resolve();
    }

}
