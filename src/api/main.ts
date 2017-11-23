import {MapService} from "./services/MapService";
import {Ipc, IpcSubjects} from "./utils/Ipc";
import {Logger} from "./dev/Logger";

const logger = Logger.getLogger('api/main.ts');

export function initApplication() {

    logger.info('Initialize main application');

    const ipc = new Ipc();
    const mapService = new MapService();

    ipc.listen(IpcSubjects.MAP_GET_WMS_URLS, mapService.getDefaultWmsLayers.bind(mapService));

}