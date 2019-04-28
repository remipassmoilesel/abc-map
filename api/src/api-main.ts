require('source-map-support').install();

import * as loglevel from 'loglevel';
import {ApiConfigHelper, IApiConfig} from './IApiConfig';
import {ApiServer} from './server/ApiServer';
import {getDaoMap} from './lib/database/IDaoMap';
import {getServices} from './lib/IServiceMap';
import {getControllers} from './server/IControllerMap';

loglevel.setDefaultLevel('info');

const logger = loglevel.getLogger('api-main.ts');
logger.info('Starting Abc-Map API ...');

const main = async function(): Promise<any> {


    const daoMap = getDaoMap();
    const serviceMap = await getServices(daoMap);
    const controllerMap = getControllers(serviceMap);

    const config = ApiConfigHelper.load();
    const httpServer = new ApiServer(config, controllerMap);
    httpServer.start();

};

main().catch(error => {
    logger.error(error);
    process.exit(1);
});
