import {asyncHandler} from '../lib/server/asyncExpressHandler';
import {AbstractController} from '../lib/server/AbstractController';
import {ApiRoutes, IUploadResponse} from 'abcmap-shared';
import {DatastoreService} from './DatastoreService';
import {DataTransformationService} from './DataTransformationService';
import express = require('express');
import multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

export class DataStoreController extends AbstractController {

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
    public uploadDocument = async (req: express.Request, res: express.Response): Promise<IUploadResponse> => {
        const username = req.params.username;
        const path = Buffer.from(req.params.path, 'base64').toString();
        const content = req.file;

        await this.datastore.storeDocument(username, path, content.buffer);
        const cache = await this.dataTransformation.toGeojson(content.buffer, path);
        await this.datastore.storeCache(username, path, Buffer.from(JSON.stringify(cache)));
        return {message: 'Uploaded', username, path};
    }

    public getDocumentList = async (req: express.Request, res: express.Response): Promise<any> => {
        const username = req.params.username;

        return this.datastore.listDocuments(username);
    }

}
