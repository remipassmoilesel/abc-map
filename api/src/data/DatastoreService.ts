import {AbstractService} from '../lib/AbstractService';
import {IPostConstruct} from '../lib/IPostConstruct';
import {IApiConfig} from '../IApiConfig';
import * as Minio from 'minio';
import {IDocument} from 'abcmap-shared';
import {DataFormatHelper} from './transform/dataformat/DataFormatHelper';
import {Logger} from 'loglevel';
import {DocumentDao} from './DocumentDao';
import loglevel = require('loglevel');
import * as Stream from 'stream';

export class DatastoreService extends AbstractService implements IPostConstruct {

    protected logger: Logger = loglevel.getLogger('UserDao');
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
        if (!formatIsAllowed) {
            return Promise.reject(new Error('Forbidden format'));
        }

        const prefixedPath = this.prefixWithUsername(username, path);

        await this.minio.putObject(this.getUsersBucketName(), prefixedPath, content, content.length);

        const document: IDocument = {
            path: prefixedPath,
            size: content.byteLength,
            description: '',
            createdAt: new Date().toISOString(),
        };

        await this.documentDao.upsertOne({path: document.path}, document);
        return document;
    }

    public async storeCache(username: string, originalPath: string, content: Buffer): Promise<any> {
        const path = this.prefixWithUsername(username, this.getCachePath(originalPath));
        return this.minio.putObject(this.getUsersBucketName(), path, content, content.length);
    }

    // TODO: paginate using a pagination request
    public listDocuments(): Promise<IDocument[]> {
        return this.documentDao.listDocuments(0, 100);
    }

    public async deleteDocument(path: string): Promise<void> {
        await this.documentDao.deleteWithPath(path);
        await this.minio.removeObject(this.getUsersBucketName(), path);
    }

    public downloadDocument(path: string): Promise<Stream> {
        return this.minio.getObject(this.getUsersBucketName(), path);
    }

    public findDocumentsByPath(paths: string[]): Promise<IDocument[]> {
        return this.documentDao.findDocumentsByPath(paths);
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

    private getCachePath(originalPath: string): string {
        return originalPath + '.cache';
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
