import {MapService} from "./services/MapService";
import {Ipc, IpcMessage} from "./ipc/Ipc";
import {Logger} from "./dev/Logger";
import {ProjectService} from "./services/ProjectService";
import {Subj} from "./ipc/IpcSubjects";
import {EntitiesUtils} from "./utils/EntitiesUtils";

const logger = Logger.getLogger('api/main.ts');
const eu = new EntitiesUtils();

function serializeResponse(data: any): IpcMessage {
    return {data: eu.serialize(data)};
}

export function initApplication(ipc: Ipc) {

    logger.info('Initialize main application');

    const projectService = new ProjectService(ipc);
    const mapService = new MapService(ipc);

    // WARNING: all methods here should use a plain object as only argument

    ipc.listen(Subj.PROJECT_CREATE_NEW, () => {
        projectService.newProject();
    });

    ipc.listen(Subj.PROJECT_GET_CURRENT, () => {
        return serializeResponse(projectService.getCurrentProject());
    });

    ipc.listen(Subj.MAP_GET_WMS_DEFAULT_LAYERS, () => {
        return serializeResponse(mapService.getDefaultWmsLayers());
    });

    projectService.newProject();
}