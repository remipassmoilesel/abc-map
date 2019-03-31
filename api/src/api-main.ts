import * as loglevel from "loglevel";
import {AbcApiConfig} from "./AbcApiConfig";
import {AbcHttpServer} from "./server/AbcHttpServer";

loglevel.setDefaultLevel("info");

const logger = loglevel.getLogger("api-main.ts");
logger.info("Starting Abc-Map API ...");

const config = new AbcApiConfig();
const httpServer = new AbcHttpServer(config);
httpServer.start();
