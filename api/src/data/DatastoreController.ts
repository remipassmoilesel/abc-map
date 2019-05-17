import {asyncHandler} from '../lib/server/asyncExpressHandler';
import {AbstractController} from '../lib/server/AbstractController';
import {ApiRoutes, IDatabaseDocument, IFetchDocumentsRequest, IResponse,
    ISearchDocumentsRequest, IUploadResponse} from 'abcmap-shared';
import {DatastoreService} from './DatastoreService';
import {DataTransformationService} from './DataTransformationService';
import {Logger} from 'loglevel';
import {authenticated, AuthenticationHelper} from '../authentication/AuthenticationHelper';
import {upload} from './UploadConfiguration';
import * as path from 'path';
import {HttpError} from '../lib/server/HttpError';
import express = require('express');
import loglevel = require('loglevel');

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
        router.post(ApiRoutes.DOCUMENTS_UPLOAD.path, authenticated(), upload(), asyncHandler(this.uploadDocuments));
        router.delete(ApiRoutes.DOCUMENTS_PATH.path, authenticated(), asyncHandler(this.deleteDocument));
        router.get(ApiRoutes.DOCUMENTS.path, asyncHandler(this.listDocuments));
        router.post(ApiRoutes.DOCUMENTS.path, asyncHandler(this.getDatabaseDocuments));
        router.get(ApiRoutes.DOCUMENTS_DOWNLOAD_PATH.path, asyncHandler(this.downloadDocument));
        router.get(ApiRoutes.DOCUMENTS_PATH.path, asyncHandler(this.getDocument));
        // tslint:enable:max-line-length
        return router;
    }

    private searchDocuments = async (req: express.Request, res: express.Response): Promise<IDatabaseDocument[]> => {
        const searchRequest: ISearchDocumentsRequest = req.body;
        return this.datastore.searchDocuments(searchRequest.query);
    }

    private downloadDocument = async (req: express.Request, res: express.Response): Promise<any> => {
        const docPath: string = this.decodePath(req.params.path);
        const fileMetadata: IDatabaseDocument = await this.datastore.getDocument(docPath);
        const fileStream = await this.datastore.downloadDocument(docPath);
        const fileName = path.basename(docPath);

        res.setHeader('Content-Type', fileMetadata.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        fileStream.pipe(res);
    }

    private getDocument = async (req: express.Request, res: express.Response): Promise<any> => {
        const docPath: string = this.decodePath(req.params.path);
        const fileStream = await this.datastore.downloadDocument(docPath);

        res.setHeader('Content-Type', 'application/json');
        fileStream.pipe(res);
    }

    // TODO: emits uploaded response later on websocket or SSE
    private uploadDocuments = async (req: express.Request, res: express.Response): Promise<IUploadResponse> => {
        const username: string = AuthenticationHelper.tokenFromRequest(req).username;
        const files: Express.Multer.File[] = req.files as Express.Multer.File[];

        const documents: IDatabaseDocument[] = [];

        for (const file of files) {
            const docPath = 'uploads/' + file.originalname;
            const document = await this.datastore.storeDocument(username, docPath, file.buffer);
            documents.push(document);

            this.cacheDocumentAsGeojson(document, file.buffer)
                .catch(err => this.logger.error(`Error while caching file. document=${document.path}`, err));
        }

        // return {message: 'Uploaded', path: document.path};
        return {message: 'Uploaded', documents};
    }

    private listDocuments = async (req: express.Request, res: express.Response): Promise<IDatabaseDocument[]> => {
        return this.datastore.listDocuments();
    }

    private getDatabaseDocuments = async (req: express.Request,
                                          res: express.Response): Promise<IDatabaseDocument[]> => {
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

    private cacheDocumentAsGeojson(document: IDatabaseDocument, buffer: Buffer) {
        return this.dataTransformation.toGeojson(buffer, document.path)
            .then(cache => this.datastore.storeCache(document.path, Buffer.from(JSON.stringify(cache))));
    }
}
