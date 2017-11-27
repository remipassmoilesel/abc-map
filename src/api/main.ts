import {MapService} from "./services/MapService";
import {Ipc} from "./ipc/Ipc";
import {Logger} from "./dev/Logger";
import {ProjectService} from "./services/ProjectService";
import {IpcSubjects} from "./ipc/IpcSubjects";
import {IpcEvent} from "./ipc/IpcEvent";

const logger = Logger.getLogger('api/main.ts');

export function initApplication(ipc: Ipc) {

    logger.info('Initialize main application');

    const projectService = new ProjectService(ipc);
    const mapService = new MapService(ipc);

    ipc.listen(IpcSubjects.PROJECT_CREATE_NEW, () => {
        return projectService.newProject();
    });

    ipc.listen(IpcSubjects.PROJECT_GET_CURRENT, () => {
        return projectService.getCurrentProject();
    });

    ipc.listen(IpcSubjects.PROJECT_ADD_LAYER, (event: IpcEvent) => {
        return projectService.addLayer(event.data);
    });

    ipc.listen(IpcSubjects.PROJECT_DELETE_LAYERS, (event: IpcEvent) => {
        return projectService.deleteLayers(event.data);
    });

    ipc.listen(IpcSubjects.MAP_GET_WMS_DEFAULT_LAYERS, () => {
        return mapService.getDefaultWmsLayers();
    });


    projectService.newProject();
}