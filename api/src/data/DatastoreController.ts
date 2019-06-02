import {asyncHandler} from '../lib/server/asyncExpressHandler';
import {AbstractController} from '../lib/server/AbstractController';
import {
    ApiRoutes,
    CacheTypes,
    IDocument,
    IFetchDocumentsRequest,
    IResponse,
    ISearchDocumentsRequest,
    IUploadResponse,
} from 'abcmap-shared';
import {DatastoreService} from './DatastoreService';
import {Logger} from 'loglevel';
import {authenticated, AuthenticationHelper} from '../authentication/AuthenticationHelper';
import {upload} from './UploadConfiguration';
import * as path from 'path';
import {HttpError} from '../lib/server/HttpError';
import express = require('express');
import loglevel = require('loglevel');

export class DatastoreController extends AbstractController {

    protected logger: Logger = loglevel.getLogger('ProjectDao');

    constructor(private datastore: DatastoreService) {
        super();
    }

    public getRouter(): express.Router {
        // tslint:disable:max-line-length
        const router = express.Router();
        router.get(ApiRoutes.DOCUMENTS.path, asyncHandler(this.listDocuments));
        router.get(ApiRoutes.DOCUMENTS_DOWNLOAD_PATH.path, asyncHandler(this.downloadDocumentRaw));
        router.get(ApiRoutes.DOCUMENTS_PATH.path, asyncHandler(this.getDocumentContentAsStream));
        router.get(ApiRoutes.DOCUMENTS_GEOJSON_PATH.path, asyncHandler(this.getDocumentGeojsonContentAsStream));
        router.post(ApiRoutes.DOCUMENTS.path, asyncHandler(this.getDocuments));
        router.post(ApiRoutes.DOCUMENTS_SEARCH.path, asyncHandler(this.searchDocuments));
        router.post(ApiRoutes.DOCUMENTS_UPLOAD.path, authenticated(), upload(), asyncHandler(this.uploadDocuments));
        router.delete(ApiRoutes.DOCUMENTS_PATH.path, authenticated(), asyncHandler(this.deleteDocument));
        // tslint:enable:max-line-length
        return router;
    }

    private searchDocuments = async (req: express.Request, res: express.Response): Promise<IDocument[]> => {
        const searchRequest: ISearchDocumentsRequest = req.body;
        return this.datastore.searchDocuments(searchRequest.query);
    }

    private downloadDocumentRaw = async (req: express.Request, res: express.Response): Promise<any> => {
        const docPath: string = this.decodePath(req.params.path);
        const downloadable = await this.datastore.downloadDocument(docPath);
        const fileName = path.basename(docPath);

        res.setHeader('Content-Type', downloadable.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        downloadable.content.pipe(res);
    }

    private getDocumentContentAsStream = async (req: express.Request, res: express.Response): Promise<any> => {
        const docPath: string = this.decodePath(req.params.path);
        const downloadable = await this.datastore.downloadDocument(docPath);

        res.setHeader('Content-Type', downloadable.mimeType);
        downloadable.content.pipe(res);
    }

    private getDocumentGeojsonContentAsStream = async (req: express.Request, res: express.Response): Promise<any> => {
        const docPath: string = this.decodePath(req.params.path);
        const downloadable = await this.datastore.downloadDocument(docPath, CacheTypes.GEOJSON);

        res.setHeader('Content-Type', downloadable.mimeType);
        downloadable.content.pipe(res);
    }

    // TODO: emits uploaded response later on websocket or SSE
    private uploadDocuments = async (req: express.Request, res: express.Response): Promise<IUploadResponse> => {
        const username: string = AuthenticationHelper.tokenFromRequest(req).username;
        const files: Express.Multer.File[] = req.files as Express.Multer.File[];

        const documents: Array<Promise<IDocument>> = [];

        for (const file of files) {
            const docPath = username + '/uploads/' + file.originalname;
            documents.push(
                this.datastore.storeDocument(username, docPath, file.buffer),
            );

            this.datastore.cacheDocumentAsGeojson(docPath, file.buffer)
                .catch(err => this.logger.error(`Error while caching file. document=${docPath}`, err));
        }

        return Promise.all(documents)
            .then((docs: IDocument[]) => {
                return {message: 'Uploaded', documents: docs};
            });
    }

    private listDocuments = async (req: express.Request, res: express.Response): Promise<IDocument[]> => {
        const start = req.query.start || 0;
        const size = req.query.start || 100;
        return this.datastore.listDocuments(start, size);
    }

    private getDocuments = async (req: express.Request, res: express.Response): Promise<IDocument[]> => {
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
