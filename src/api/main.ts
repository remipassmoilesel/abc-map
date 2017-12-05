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

    const databaseService = new DatabaseService(ipc);
    databaseService.startDatabase();

    databaseService.connect().then((db) => {
        logger.info('Connected to database');

        const projectService = new ProjectService(ipc);
        const mapService = new MapService(ipc);
        
        const services: IServicesMap = {
            project: projectService,
            map: mapService,
            db: databaseService,
        };

        const projectHandlers = new ProjectHandlers(ipc, services);
        const mapHandlers = new MapHandlers(ipc, services);
        const dbHandlers = new DatabaseHandlers(ipc, services);

        projectHandlers.createNewProject();
    })

}