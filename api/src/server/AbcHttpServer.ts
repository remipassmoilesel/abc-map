import express = require('express');
import * as _ from 'lodash';
import * as loglevel from 'loglevel';
import {AbcApiConfig} from '../AbcApiConfig';
import {ProjectRouter} from "./routers/ProjectRouter";

export class AbcHttpServer {

    private logger = loglevel.getLogger('AbcHttpServer');

    private routers = [
        new ProjectRouter(),
    ];

    private app: express.Application;

    constructor(private config: AbcApiConfig) {
        this.app = express();
        this.setupRouters();
    }

    public start() {
        this.app.listen(this.config.PORT, () => {
            this.logger.info(`Server started on port ${this.config.PORT}`);
        });
    }

    private setupRouters() {
        _.forEach(this.routers, (gr) => {
            this.app.use(gr.getRouter());
        });
    }
}
