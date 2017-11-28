import {MapService} from "./services/MapService";
import {Ipc} from "./ipc/Ipc";
import {Logger} from "./dev/Logger";
import {ProjectService} from "./services/ProjectService";
import {DatabaseService} from "./services/DatabaseService";
import {IServicesMap} from "./handlers/AbstractHandlersGroup";
import {ProjectHandlers} from "./handlers/ProjectHandlers";
import {MapHandlers} from "./handlers/MapHandlers";
import {DatabaseHandlers} from "./handlers/DatabaseHandlers";

const logger = Logger.getLogger('api/main.ts');

export function initApplication(ipc: Ipc) {

    logger.info('Initialize main application');

    const projectService = new ProjectService(ipc);
    const mapService = new MapService(ipc);
    const databaseService = new DatabaseService(ipc);

    databaseService.startDatabase();

    const services: IServicesMap = {
        project: projectService,
        map: mapService,
        db: databaseService,
    };

    new ProjectHandlers().init(ipc, services);
    new MapHandlers().init(ipc, services);
    new DatabaseHandlers().init(ipc, services);

    projectService.newProject();
}