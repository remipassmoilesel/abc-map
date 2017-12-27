import {globalShortcut} from 'electron';
import {MapService} from './services/MapService';
import {Ipc} from './ipc/Ipc';
import {Logger} from './dev/Logger';
import {ProjectService} from './services/ProjectService';
import {DatabaseService} from './services/DatabaseService';
import {IServicesMap} from './handlers/AbstractHandlersGroup';
import {ProjectHandlers} from './handlers/ProjectHandlers';
import {MapHandlers} from './handlers/MapHandlers';
import {DatabaseHandlers} from './handlers/DatabaseHandlers';
import {GlobalShortcutsService} from './utils/GlobalShortcutsService';

const logger = Logger.getLogger('api/main.ts');
let databaseService: DatabaseService;

export async function initApplication(ipc: Ipc): Promise<IServicesMap> {

    logger.info('Initialize main application');

    databaseService = new DatabaseService(ipc, 'abc-map');
    databaseService.startDatabase();

    try {
        const db = await databaseService.connect();

        logger.info('Connected to database');

        const projectService = new ProjectService(ipc);
        const mapService = new MapService(ipc);
        const shortcutsService = new GlobalShortcutsService(ipc);

        const services: IServicesMap = {
            db: databaseService,
            map: mapService,
            project: projectService,
            shortcuts: shortcutsService,
        };

        const projectHandlers = new ProjectHandlers(ipc, services);
        const mapHandlers = new MapHandlers(ipc, services);
        const dbHandlers = new DatabaseHandlers(ipc, services);

        await projectHandlers.createNewProject();

        return services;

    } catch (e) {
        console.error('Error while connecting to database: ', e);
        process.exit(1);
    }

}

export async function stopApplication(): Promise<any> {
    logger.info('Closing main application');
    await databaseService.stopDatabase();
}
