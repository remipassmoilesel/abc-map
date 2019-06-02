// tslint:disable-next-line:no-var-requires
require('source-map-support').install();

import * as loglevel from 'loglevel';
import {ApiConfigHelper} from './IApiConfig';
import {ApiServer} from './lib/server/ApiServer';
import {getDaoMap} from './lib/database/IDaoMap';
import {getServices} from './lib/IServiceMap';
import {getControllers} from './lib/IControllerMap';

loglevel.setDefaultLevel('info');

const logger = loglevel.getLogger('api-main.ts');
logger.info('Starting Abc-Map API ...');

export const mainStartup = async function(): Promise<any> {

    const config = ApiConfigHelper.load();
    const daoMap = await getDaoMap(config);
    const serviceMap = await getServices(daoMap, config);
    const controllerMap = getControllers(serviceMap, config);

    const httpServer = new ApiServer(config, controllerMap);
    httpServer.start();

};

mainStartup().catch(error => {
    logger.error(error);
    process.exit(1);
});
