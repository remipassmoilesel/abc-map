import * as loglevel from "loglevel";
import {AbcApiConfig} from "./AbcApiConfig";
import {AbcHttpServer} from "./lib/server/AbcHttpServer";
import {getDaoMap} from "./lib/database/IDaoMap";
import {getServices} from "./lib/IServiceMap";
import {getControllers} from "./lib/server/IControllerMap";

loglevel.setDefaultLevel("info");

const logger = loglevel.getLogger("api-main.ts");
logger.info("Starting Abc-Map API ...");

const daoMap = getDaoMap();
const serviceMap = getServices(daoMap);
const controllerMap = getControllers(serviceMap);

const config = new AbcApiConfig();
const httpServer = new AbcHttpServer(config, controllerMap);
httpServer.start();
