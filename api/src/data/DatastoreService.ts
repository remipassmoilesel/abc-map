import {AbstractService} from '../lib/AbstractService';
import {IPostConstruct} from '../lib/IPostConstruct';
import {IApiConfig} from '../IApiConfig';
import * as Minio from 'minio';
import {IDocument, IDocumentStream} from 'abcmap-shared';
import {DataFormatHelper} from './transform/dataformat/DataFormatHelper';
import {Logger} from 'loglevel';
import {DocumentDao} from './DocumentDao';
import * as _ from 'lodash';
import {CacheHelper, CacheType} from 'abcmap-shared/dist/data/CacheType';
import loglevel = require('loglevel');

export class DatastoreService extends AbstractService implements IPostConstruct {

    protected logger: Logger = loglevel.getLogger('DatastoreService');
    private minio!: Minio.Client;

    constructor(private config: IApiConfig,
                private documentDao: DocumentDao) {
        super();
    }

    public async postConstruct(): Promise<any> {
        this.minio = this.minioConnection();
        this.createBucketIfNecessary()
            .catch(err => this.logger.error(err));
    }

    private minioConnection() {
        return new Minio.Client(this.config.minio);
    }

    public async storeDocument(username: string, path: string, content: Buffer): Promise<IDocument> {
        const formatIsAllowed = await DataFormatHelper.isDataFormatAllowed(content, path);
        const mimeType = await DataFormatHelper.inspectMimeType(content);
        if (!formatIsAllowed) {
            return Promise.reject(new Error(`Unsupported format: ${path}`));
        }

        const prefixedPath = this.prefixWithUsername(username, path);
        await this.minio.putObject(this.getUsersBucketName(), prefixedPath, content, content.length);

        const document: IDocument = {
            owner: username,
            path: prefixedPath,
            size: content.byteLength,
            description: '',
            createdAt: new Date().toISOString(),
            mimeType,
        };

        await this.documentDao.upsertOne({path: document.path}, document);
        return document;
    }

    public getDocument(docPath: string): Promise<IDocument> {
        return this.documentDao.findByPath(docPath);
    }

    public async storeCache(originalPath: string, content: Buffer): Promise<any> {
        const path = CacheHelper.getGeojsonCachePath(originalPath);
        return this.minio.putObject(this.getUsersBucketName(), path, content, content.length);
    }

    // TODO: paginate using a pagination request
    public listDocuments(start: number, size: number): Promise<IDocument[]> {
        return this.documentDao.list(start, size);
    }

    public async deleteDocument(path: string): Promise<void> {
        await this.documentDao.deleteByPath(path);
        await this.minio.removeObject(this.getUsersBucketName(), path);

        // TODO: find by pattern then delete in order to remove all cache. E.g: /paul/upload/regions.shp**
        await this.minio.removeObject(this.getUsersBucketName(), CacheHelper.getGeojsonCachePath(path));
    }

    public downloadDocument(path: string, cacheType?: CacheType): Promise<IDocumentStream> {
        let documentObjectPath = path;
        if (cacheType) {
            documentObjectPath = CacheHelper.getCachePath(path, cacheType);
        }
        return Promise
            .all([
                this.documentDao.findByPath(path),
                this.minio.getObject(this.getUsersBucketName(), documentObjectPath),
            ])
            .then(results => {
                return _.merge({}, results[0], {content: results[1]});
            });
    }

    public findDocumentsByPath(paths: string[]): Promise<IDocument[]> {
        return this.documentDao.findManyByPath(paths);
    }

    public searchDocuments(query: any): Promise<IDocument[]> {
        return this.documentDao.search(query);
    }

    private async createBucketIfNecessary() {
        const bucketExists = await this.minio.bucketExists(this.getUsersBucketName());
        if (!bucketExists) {
            await this.minio.makeBucket(this.getUsersBucketName(), this.getRegion());
        }
    }

    private getRegion(): string {
        return `${this.getBucketPrefix()}.region-1`;
    }

    private getUsersBucketName(): string {
        return `${this.getBucketPrefix()}.user-data`;
    }

    private getBucketPrefix(): string {
        return `abcmap.${this.config.environmentName}`;
    }

    private prefixWithUsername(username: string, path: string): string {
        return `${username}/${path}`;
    }

}
