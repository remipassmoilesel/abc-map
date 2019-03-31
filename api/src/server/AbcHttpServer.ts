import express = require("express");
import * as _ from "lodash";
import * as loglevel from "loglevel";
import {AbcApiConfig} from "../AbcApiConfig";
import {HelloWorldRouter} from "./handlers/HelloWorldRouter";

export class AbcHttpServer {

    private logger = loglevel.getLogger("AbcHttpServer");

    private app: express.Application;
    private handlerGroups = [
        new HelloWorldRouter(),
    ];

    constructor(private config: AbcApiConfig) {
        this.app = express();
        this.setupHandlers();
    }

    public start() {
        this.app.listen(this.config.PORT, () => {
            this.logger.info(`Server started on port ${this.config.PORT}`);
        });
    }

    private setupHandlers() {
        _.forEach(this.handlerGroups, (gr) => {
            this.app.use(gr.basePath, gr.getRouter());
        });
    }
}
