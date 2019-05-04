import {asyncHandler} from '../lib/server/asyncExpressHandler';
import {AbstractController} from '../lib/server/AbstractController';
import {ApiRoutes} from 'abcmap-shared';
import {DatastoreService} from './DatastoreService';
import express = require('express');

export class DataStoreController extends AbstractController {

    constructor(private datastore: DatastoreService) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();
        router.post(ApiRoutes.DATASTORE.path, asyncHandler(this.uploadDocument));
        return router;
    }

    public uploadDocument = async (req: express.Request, res: express.Response): Promise<any> => {
        const client = this.datastore.connect();
        await client.makeBucket('uploads', 'hey');
        client.presignedPutObject('uploads', req.params.name, (err, url) => {
            if (err) {
                throw err;
            }
            res.end(url);
        });
    }

}
