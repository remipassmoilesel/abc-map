import express = require('express');
import * as _ from 'lodash';
import * as loglevel from 'loglevel';
import {AbcApiConfig} from '../../AbcApiConfig';
import {IControllerMap} from "./IControllerMap";
import expressWebsocket = require('express-ws');

export class ApiServer {

    private logger = loglevel.getLogger('ApiServer');

    private app: express.Application;

    constructor(private config: AbcApiConfig,
                private controllers: IControllerMap) {
        this.app = express();
        expressWebsocket(this.app);

        this.setupControllers();
        this.setupGuiService();
    }

    public start() {
        this.app.listen(this.config.PORT, () => {
            this.logger.info(`Server started on port ${this.config.PORT}`);
        });
    }

    private setupControllers() {
        _.forEach(_.values(this.controllers), (gr) => this.app.use(gr.getRouter()));
    }

    private setupGuiService() {
        this.app.use(express.static('gui-dist'));
    }
}
