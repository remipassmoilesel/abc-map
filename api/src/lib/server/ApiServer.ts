import express = require('express');
import morgan = require('morgan');
import expressWebsocket = require('express-ws');
import bodyParser = require('body-parser');
import passport = require('passport');
import {IControllerMap} from './IControllerMap';
import * as _ from 'lodash';
import * as loglevel from 'loglevel';
import {JwtStrategy} from './JwtStrategy';
import {IApiConfig} from '../../IApiConfig';

export class ApiServer {

    private logger = loglevel.getLogger('ApiServer');

    private app: express.Application;

    constructor(private config: IApiConfig,
                private controllers: IControllerMap) {
        this.app = express();

        this.setupMorgan(this.app);
        this.setupBodyParser(this.app);
        this.setupPassport(this.app);
        this.setupWebsockets(this.app);
        this.setupControllers(this.app);
        this.setupGuiService(this.app);
    }

    public start(): void {
        this.app.listen(this.config.httpPort, () => {
            this.logger.info(`Server started on port ${this.config.httpPort}`);
        });
    }

    private setupMorgan(app: express.Application): void {
        app.use(morgan('dev'));
    }

    private setupPassport(app: express.Application): void {
        passport.use(JwtStrategy);
        app.use(passport.initialize());
    }

    private setupBodyParser(app: express.Application): void {
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
    }

    private setupWebsockets(app: express.Application): void {
        expressWebsocket(app);
    }

    private setupControllers(app: express.Application): void {
        _.forEach(_.values(this.controllers), (gr) => app.use(gr.getRouter()));
    }

    private setupGuiService(app: express.Application): void {
        app.use(express.static('gui-dist'));
    }

}
