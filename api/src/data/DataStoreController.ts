import {asyncHandler} from '../lib/server/asyncExpressHandler';
import {AbstractController} from '../lib/server/AbstractController';
import {ApiRoutes} from 'abcmap-shared';
import {DatastoreService} from './DatastoreService';
import Minio from 'minio';
import express = require('express');
import {IPostConstruct} from '../lib/IPostConstruct';

export class DataStoreController extends AbstractController {

    constructor(private datastore: DatastoreService) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();
        router.get(ApiRoutes.DATASTORE.path, asyncHandler(this.uploadDocument));
        return router;
    }

    public uploadDocument = async (req: express.Request, res: express.Response): Promise<any> => {

    }

}
