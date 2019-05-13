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
import {IResponse} from 'abcmap-shared';
import * as path from 'path';
import doc = Mocha.reporters.doc;

export class DatastoreController extends AbstractController {

    protected logger: Logger = loglevel.getLogger('ProjectDao');

    constructor(private datastore: DatastoreService,
                private dataTransformation: DataTransformationService) {
        super();
    }

    public getRouter(): express.Router {
        // tslint:disable:max-line-length
        const router = express.Router();
        router.post(ApiRoutes.DOCUMENTS_PATH.path, authenticated(), upload(), asyncHandler(this.uploadDocument));
        router.delete(ApiRoutes.DOCUMENTS_PATH.path, authenticated(), asyncHandler(this.deleteDocument));
        router.get(ApiRoutes.DOCUMENTS.path, asyncHandler(this.getDocuments));
        router.get(ApiRoutes.DOCUMENTS_PATH.path, this.downloadDocument);
        // tslint:enable:max-line-length
        return router;
    }

    // TODO: emits uploaded response later on websocket or SSE
    private uploadDocument = async (req: express.Request, res: express.Response): Promise<IUploadResponse> => {
        const username: string = AuthenticationHelper.tokenFromRequest(req).username;
        const docPath: string = this.decodePath(req.params.path);
        const content = req.file;

        await this.datastore.storeDocument(username, docPath, content.buffer)
            .catch(err => this.datastore.storeDocument(username, docPath, content.buffer))
            .catch(err => this.logger.error(err));

        this.dataTransformation.toGeojson(content.buffer, docPath)
            .then(cache => this.datastore.storeCache(username, docPath, Buffer.from(JSON.stringify(cache))))
            .catch(err => this.logger.error(err));

        return {message: 'Uploaded', path: docPath};
    }

    private getDocuments = async (req: express.Request, res: express.Response): Promise<any> => {
        return this.datastore.listDocuments();
    }

    private downloadDocument = async (req: express.Request, res: express.Response): Promise<any> => {
        const docPath: string = this.decodePath(req.params.path);
        const fileStream = await this.datastore.downloadDocument(docPath);
        const fileName = path.basename(docPath);

        res.setHeader('Content-Type', 'some/type');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        fileStream.pipe(res);
    }

    private deleteDocument = async (req: express.Request, res: express.Response): Promise<IResponse> => {
        const username: string = AuthenticationHelper.tokenFromRequest(req).username;
        const docPath: string = this.decodePath(req.params.path);

        if (!docPath.startsWith(username)) {
            return new Error('Forbidden');
        }

        await this.datastore.deleteDocument(docPath);
        return {message: 'deleted'};
    }

    private decodePath(path: string): string {
        return Buffer.from(path, 'base64').toString();
    }
}
