import {asyncHandler} from '../lib/server/asyncExpressHandler';
import {AbstractController} from '../lib/server/AbstractController';
import {
    ApiRoutes,
    IDocument,
    IFetchDocumentsRequest,
    IResponse,
    ISearchDocumentsRequest,
    IUploadResponse,
} from 'abcmap-shared';
import {DatastoreService} from './DatastoreService';
import {DataTransformationService} from './DataTransformationService';
import {Logger} from 'loglevel';
import {authenticated, AuthenticationHelper} from '../authentication/AuthenticationHelper';
import {upload} from './UploadConfiguration';
import * as path from 'path';
import {HttpError} from '../lib/server/HttpError';
import express = require('express');
import loglevel = require('loglevel');
import {DataFormatHelper} from './transform/dataformat/DataFormatHelper';

export class DatastoreController extends AbstractController {

    protected logger: Logger = loglevel.getLogger('ProjectDao');

    constructor(private datastore: DatastoreService,
                private dataTransformation: DataTransformationService) {
        super();
    }

    public getRouter(): express.Router {
        // tslint:disable:max-line-length
        const router = express.Router();
        router.post(ApiRoutes.DOCUMENTS_SEARCH.path, asyncHandler(this.searchDocuments));
        router.post(ApiRoutes.DOCUMENTS_PATH.path, authenticated(), upload(), asyncHandler(this.uploadDocument));
        router.delete(ApiRoutes.DOCUMENTS_PATH.path, authenticated(), asyncHandler(this.deleteDocument));
        router.get(ApiRoutes.DOCUMENTS.path, asyncHandler(this.listDocuments));
        router.post(ApiRoutes.DOCUMENTS.path, asyncHandler(this.fetchDocuments));
        router.get(ApiRoutes.DOCUMENTS_PATH.path, this.downloadDocument);
        // tslint:enable:max-line-length
        return router;
    }

    private searchDocuments = async (req: express.Request, res: express.Response): Promise<IDocument[]> => {
        const searchRequest: ISearchDocumentsRequest = req.body;
        return this.datastore.searchDocuments(searchRequest.query);
    }

    private downloadDocument = async (req: express.Request, res: express.Response): Promise<any> => {
        const docPath: string = this.decodePath(req.params.path);
        const fileMetadata: IDocument = await this.datastore.getDocument(docPath);
        const fileStream = await this.datastore.downloadDocument(docPath);
        const fileName = path.basename(docPath);

        res.setHeader('Content-Type', fileMetadata.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        fileStream.pipe(res);
    }

    // TODO: emits uploaded response later on websocket or SSE
    private uploadDocument = async (req: express.Request, res: express.Response): Promise<IUploadResponse> => {
        const username: string = AuthenticationHelper.tokenFromRequest(req).username;
        const docPath: string = this.decodePath(req.params.path);
        const content = req.file;

        const document = await this.datastore.storeDocument(username, docPath, content.buffer);

        this.dataTransformation.toGeojson(content.buffer, docPath)
            .then(cache => this.datastore.storeCache(username, docPath, Buffer.from(JSON.stringify(cache))))
            .catch(err => this.logger.error(err));

        return {message: 'Uploaded', path: document.path};
    }

    private listDocuments = async (req: express.Request, res: express.Response): Promise<IDocument[]> => {
        return this.datastore.listDocuments();
    }

    private fetchDocuments = async (req: express.Request, res: express.Response): Promise<IDocument[]> => {
        const docRequest: IFetchDocumentsRequest = req.body;
        return this.datastore.findDocumentsByPath(docRequest.paths);
    }

    private deleteDocument = async (req: express.Request, res: express.Response): Promise<IResponse> => {
        const username: string = AuthenticationHelper.tokenFromRequest(req).username;
        const docPath: string = this.decodePath(req.params.path);

        if (!docPath.startsWith(username)) {
            return new HttpError('Forbidden', 403);
        }

        await this.datastore.deleteDocument(docPath);
        return {message: 'deleted'};
    }

    private decodePath(documentPath: string): string {
        return Buffer.from(documentPath, 'base64').toString();
    }
}
