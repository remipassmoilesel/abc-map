import express = require('express');
import {AbcApiConfig} from "../AbcApiConfig";
import * as loglevel from 'loglevel';
import {HelloWorldRouter} from "./handlers/HelloWorldRouter";
import * as _ from "lodash";

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
            this.logger.info(`Server started on port ${this.config.PORT}`)
        })
    }

    private setupHandlers() {
        _.forEach(this.handlerGroups, gr => {
            this.app.use(gr.basePath, gr.getRouter());
        });
    }
}
