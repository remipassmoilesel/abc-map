import express = require('express');
import morgan = require('morgan');
import expressWebsocket = require('express-ws');
import bodyParser = require('body-parser');
import passport = require('passport');
import {IControllerMap} from '../IControllerMap';
import * as _ from 'lodash';
import * as loglevel from 'loglevel';
import {JwtStrategy} from './JwtStrategy';
import {IApiConfig} from '../../IApiConfig';
import {AuthenticationHelper} from '../../authentication/AuthenticationHelper';

export class ApiServer {

    private logger = loglevel.getLogger('ApiServer');

    private app: express.Application;

    constructor(private config: IApiConfig,
                private controllers: IControllerMap) {
        this.app = express();

        this.setupMorgan(this.app);
        this.setupBodyParser(this.app);
        this.setupAuthentication(this.app);
        this.setupWebsockets(this.app);
        this.setupControllers(this.app);
        this.setupGuiService(this.app);
        this.setupRedirection(this.app);
    }

    public start(): void {
        this.app.listen(this.config.httpPort, () => {
            this.logger.info(`Server started on port ${this.config.httpPort}`);
            this.logger.info(`Configuration:`);
            this.logger.info(JSON.stringify(this.config, null, 2));
        });
    }

    private setupMorgan(app: express.Application): void {
        app.use(morgan('dev'));
    }

    private setupAuthentication(app: express.Application): void {
        passport.use(JwtStrategy);
        app.use(passport.initialize());
        app.use(AuthenticationHelper.tokenInjector());
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
        app.use(express.static(this.config.frontend.rootPath));
    }

    private setupRedirection(app: express.Application) {
        app.use((req, res, next) => {
            if (req.originalUrl.startsWith('/api')) {
                this.logger.info(`Api route not found: ${req.originalUrl}`);
                return res.status(404).send({message: 'Not found'});
            }
            if (req.originalUrl !== '/') {
                this.logger.info(`Redirecting: ${req.originalUrl}`);
                return res.redirect('/');
            }
            res.status(500).send({message: 'Root handler not found'});
        });
    }
}
