import {asyncHandler} from '../lib/server/asyncExpressHandler';
import {AbstractController} from '../lib/server/AbstractController';
import {ApiRoutes} from 'abcmap-shared';
import {DatastoreService} from './DatastoreService';
import express = require('express');
import multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

export class DataStoreController extends AbstractController {

    constructor(private datastore: DatastoreService) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();
        router.post(ApiRoutes.DATASTORE.path, upload.single('file-content'), asyncHandler(this.uploadDocument));
        return router;
    }

    public uploadDocument = async (req: express.Request, res: express.Response): Promise<any> => {
        const username = req.params.username;
        const path = Buffer.from(req.params.path, 'base64').toString();
        const content = req.file;

        return this.datastore.storeObject(username, path, content.buffer);
    };

}
