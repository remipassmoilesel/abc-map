import {AbcHttpServer} from "./server/AbcHttpServer";
import {AbcApiConfig} from "./AbcApiConfig";
import * as loglevel from "loglevel";

loglevel.setDefaultLevel('info');

const logger = loglevel.getLogger("api-main.ts")
logger.info("Starting Abc-Map API ...");

const config = new AbcApiConfig();
const httpServer = new AbcHttpServer(config);
httpServer.start();
