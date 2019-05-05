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
        router.post(ApiRoutes.DATASTORE_CREATE.path, upload.single('file-content'), asyncHandler(this.uploadDocument));
        router.get(ApiRoutes.DATASTORE.path, asyncHandler(this.getDocumentList));
        return router;
    }

    // TODO: ensure authentication and username
    public uploadDocument = async (req: express.Request, res: express.Response): Promise<any> => {
        const username = req.params.username;
        const path = Buffer.from(req.params.path, 'base64').toString();
        const content = req.file;

        return this.datastore.storeDocument(username, path, content.buffer);
    }

    public getDocumentList = async (req: express.Request, res: express.Response): Promise<any> => {
        const username = req.params.username;

        return this.datastore.getDocuments(username);
    }

}
