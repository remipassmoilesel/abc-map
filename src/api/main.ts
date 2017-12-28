import {globalShortcut} from 'electron';
import {MapService} from './services/MapService';
import {Ipc} from './ipc/Ipc';
import {Logger} from './dev/Logger';
import {ProjectService} from './services/ProjectService';
import {DatabaseService} from './services/DatabaseService';
import {AbstractHandlersGroup, IHandlersMap, IServicesMap} from './handlers/AbstractHandlersGroup';
import {ProjectHandlers} from './handlers/ProjectHandlers';
import {MapHandlers} from './handlers/MapHandlers';
import {DatabaseHandlers} from './handlers/DatabaseHandlers';
import {GlobalShortcutsService} from './utils/GlobalShortcutsService';
import {AbstractService} from './services/AbstractService';

const logger = Logger.getLogger('api/main.ts');

let services: IServicesMap;
let handlers: IHandlersMap;

export async function initApplication(ipc: Ipc): Promise<IServicesMap> {

    logger.info('Initialize main application');

    const databaseService = new DatabaseService(ipc, 'abc-map');
    databaseService.startDatabase();

    try {
        const db = await databaseService.connect();

        logger.info('Connected to database');

        const projectService = new ProjectService(ipc);
        const mapService = new MapService(ipc);
        const shortcutsService = new GlobalShortcutsService(ipc);

        services = {
            db: databaseService,
            map: mapService,
            project: projectService,
            shortcuts: shortcutsService,
        };

        const projectHandlers = new ProjectHandlers(ipc, services);
        const mapHandlers = new MapHandlers(ipc, services);
        const databaseHandlers = new DatabaseHandlers(ipc, services);

        handlers = {
            db: databaseHandlers,
            map: mapHandlers,
            project: projectHandlers,
        };

        await projectHandlers.createNewProject();

        return services;

    } catch (e) {
        console.error('Error while connecting to database: ', e);
        process.exit(1);
    }

}

export async function stopApplication(): Promise<any> {
    logger.info('Closing main application');

    logger.info('Stopping handlers');
    for (const propName in handlers) {
        if (handlers.hasOwnProperty(propName)) {
            const handlerGroup: AbstractHandlersGroup = handlers[propName];
            await handlerGroup.onAppExit();
        }
    }

    logger.info('Stopping services');
    for (const propName in services) {
        if (services.hasOwnProperty(propName)) {
            const service: AbstractService = services[propName];
            await service.onAppExit();
        }
    }

}
