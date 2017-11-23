import {MapService} from "./services/MapService";
import {Ipc, IpcSubjects} from "./utils/Ipc";
import {Logger} from "./dev/Logger";
import {ProjectService} from "./services/ProjectService";

const logger = Logger.getLogger('api/main.ts');
const ipc = new Ipc();

export function initApplication() {

    logger.info('Initialize main application');


    const projectService = new ProjectService();
    const mapService = new MapService();

    // WARNING: all methods here should use a plain object as argument

    ipc.listen(IpcSubjects.PROJECT_CREATE_NEW, projectService.newProject.bind(projectService));
    ipc.listen(IpcSubjects.PROJECT_GET_CURRENT, projectService.getCurrentProject.bind(mapService));

    ipc.listen(IpcSubjects.MAP_GET_WMS_URLS, mapService.getDefaultWmsLayers.bind(mapService));


    projectService.newProject();
}