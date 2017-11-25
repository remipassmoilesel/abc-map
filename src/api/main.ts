import {MapService} from "./services/MapService";
import {Ipc} from "./ipc/Ipc";
import {Logger} from "./dev/Logger";
import {ProjectService} from "./services/ProjectService";
import {Subj} from "./ipc/IpcSubjects";

const logger = Logger.getLogger('api/main.ts');

export function initApplication(ipc: Ipc) {

    logger.info('Initialize main application');

    const projectService = new ProjectService(ipc);
    const mapService = new MapService(ipc);

    // WARNING: all methods here should use a plain object as only argument

    ipc.listen(Subj.PROJECT_CREATE_NEW, projectService.newProject.bind(projectService));
    ipc.listen(Subj.PROJECT_GET_CURRENT, projectService.getCurrentProject.bind(mapService));

    ipc.listen(Subj.MAP_GET_WMS_DEFAULT_LAYERS, mapService.getDefaultWmsLayers.bind(mapService));


    projectService.newProject();
}