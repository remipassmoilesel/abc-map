import {asyncHandler} from '../lib/server/asyncExpressHandler';
import {AbstractController} from '../lib/server/AbstractController';
import {ApiRoutes, IUploadResponse} from 'abcmap-shared';
import {DatastoreService} from './DatastoreService';
import {DataTransformationService} from './DataTransformationService';
import {Logger} from 'loglevel';
import express = require('express');
import loglevel = require('loglevel');
import {authenticated, AuthenticationHelper} from '../authentication/AuthenticationHelper';
import {upload} from './UploadConfiguration';

export class DataStoreController extends AbstractController {

    protected logger: Logger = loglevel.getLogger('ProjectDao');

    constructor(private datastore: DatastoreService,
                private dataTransformation: DataTransformationService) {
        super();
    }

    public getRouter(): express.Router {
        // tslint:disable:max-line-length
        const router = express.Router();
        router.post(ApiRoutes.DOCUMENTS_PATH.path, authenticated(), upload(), asyncHandler(this.uploadDocument));
        router.get(ApiRoutes.DOCUMENTS.path, asyncHandler(this.getDocuments));
        router.get(ApiRoutes.DOCUMENTS_PATH.path, asyncHandler(this.getDocument));
        router.get(ApiRoutes.DOCUMENTS_USERNAME.path, asyncHandler(this.getUserDocuments));
        // tslint:enable:max-line-length
        return router;
    }

    // TODO: emits uploaded response later on websocket or SSE
    public uploadDocument = async (req: express.Request, res: express.Response): Promise<IUploadResponse> => {
        const username: string = AuthenticationHelper.tokenFromRequest(req).username;
        const path: string = Buffer.from(req.params.path, 'base64').toString();
        const content = req.file;

        await this.datastore.storeDocument(username, path, content.buffer)
            .catch(err => this.datastore.storeDocument(username, path, content.buffer))
            .catch(err => this.logger.error(err));

        this.dataTransformation.toGeojson(content.buffer, path)
            .then(cache => this.datastore.storeCache(username, path, Buffer.from(JSON.stringify(cache))))
            .catch(err => this.logger.error(err));

        return {message: 'Uploaded', path};
    }

    public getDocuments = async (req: express.Request, res: express.Response): Promise<any> => {
        return this.datastore.listDocuments();
    }

    public getUserDocuments = async (req: express.Request, res: express.Response): Promise<any> => {
        const username = req.params.username;
        return this.datastore.listDocuments();
    }

    public getDocument = async (req: express.Request, res: express.Response): Promise<any> => {
        const username: string = req.params.username;
        const path: string = req.params.path;
        // TODO: implement
    }

}
