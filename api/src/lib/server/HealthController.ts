import {AbstractController} from './AbstractController';
import {NextFunction} from 'express';
import {IServiceMap} from '../IServiceMap';
import {ApiRoutes} from 'abcmap-shared';
import express = require('express');
import {asyncHandler} from './asyncExpressHandler';

export class HealthController extends AbstractController {

    constructor(private serviceMap: IServiceMap) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();
        router.get(ApiRoutes.HEALTH_CHECK.path, asyncHandler(this.healthCheck));
        return router;
    }

    // TODO: check database connections
    private healthCheck = async (req: express.Request, res: express.Response, next: NextFunction) => {
        return {state: 'ok'};
    }

}
