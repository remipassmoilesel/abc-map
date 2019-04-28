import express = require('express');
import morgan = require('morgan');
import expressWebsocket = require('express-ws');
import session = require('express-session');
import bodyParser = require('body-parser');
import * as _ from 'lodash';
import * as loglevel from 'loglevel';
import {IApiConfig} from '../IApiConfig';
import {IControllerMap} from './IControllerMap';

export class ApiServer {

    private logger = loglevel.getLogger('ApiServer');

    private app: express.Application;

    constructor(private config: IApiConfig,
                private controllers: IControllerMap) {
        this.app = express();

        this.setupMorgan(this.app);
        this.setupBodyparser(this.app);
        this.setupWebsockets(this.app);
        this.setupSessions(this.app);
        this.setupControllers(this.app);
        this.setupGuiService(this.app);
    }

    public start(): void {
        this.app.listen(this.config.httpPort, () => {
            this.logger.info(`Server started on port ${this.config.httpPort}`);
        });
    }

    private setupControllers(app: express.Application): void {
        _.forEach(_.values(this.controllers), (gr) => app.use(gr.getRouter()));
    }

    private setupGuiService(app: express.Application): void {
        app.use(express.static('gui-dist'));
    }

    private setupMorgan(app: express.Application): void {
        app.use(morgan('dev'));
    }

    private setupBodyparser(app: express.Application): void {
        app.use(bodyParser.json());
    }

    private setupWebsockets(app: express.Application): void {
        expressWebsocket(app);
    }

    private setupSessions(app: express.Application) {
        app.use(session({
            secret: this.config.sessionSecret,
            cookie: {maxAge: 60000},
            resave: false,
            saveUninitialized: false
        }));
    }
}
