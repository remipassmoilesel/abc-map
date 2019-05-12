import {asyncHandler} from '../lib/server/asyncExpressHandler';
import {AbstractController} from '../lib/server/AbstractController';
import {ApiRoutes, IUploadResponse} from 'abcmap-shared';
import {DatastoreService} from './DatastoreService';
import {DataTransformationService} from './DataTransformationService';
import {Logger} from 'loglevel';
import express = require('express');
import multer = require('multer');
import loglevel = require('loglevel');

const storage = multer.memoryStorage();
const upload = multer({storage});

export class DataStoreController extends AbstractController {

    protected logger: Logger = loglevel.getLogger('ProjectDao');

    constructor(private datastore: DatastoreService,
                private dataTransformation: DataTransformationService) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();
        router.post(ApiRoutes.DATASTORE_CREATE.path, upload.single('file-content'), asyncHandler(this.uploadDocument));
        router.get(ApiRoutes.DATASTORE.path, asyncHandler(this.getDocumentList));
        return router;
    }

    // TODO: ensure authentication and username
    // TODO: emits uploaded response later on websocket or SSE
    public uploadDocument = async (req: express.Request, res: express.Response): Promise<IUploadResponse> => {
        const username = req.params.username;
        const path = Buffer.from(req.params.path, 'base64').toString();
        const content = req.file;

        this.datastore.storeDocument(username, path, content.buffer)
            .catch(err => this.datastore.storeDocument(username, path, content.buffer))
            .catch(err => this.logger.error(err));

        this.dataTransformation.toGeojson(content.buffer, path)
            .then(cache => this.datastore.storeCache(username, path, Buffer.from(JSON.stringify(cache))))
            .catch(err => this.logger.error(err));

        return {message: 'Uploaded', username, path};
    }

    public getDocumentList = async (req: express.Request, res: express.Response): Promise<any> => {
        const username = req.params.username;

        return this.datastore.listDocuments(username);
    }

}
