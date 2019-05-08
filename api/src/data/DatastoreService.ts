import {AbstractService} from '../lib/AbstractService';
import {IPostConstruct} from '../lib/IPostConstruct';
import {IApiConfig} from '../IApiConfig';
import * as Minio from 'minio';
import {BucketItem} from 'minio';
import {IDocument} from 'abcmap-shared';
import {DataFormatHelper} from './transform/dataformat/DataFormatHelper';
import * as _ from 'lodash';

// TODO: create a dedicated bucket for user's data
export class DatastoreService extends AbstractService implements IPostConstruct {

    private static readonly REGION = 'region1';

    private client!: Minio.Client;

    constructor(private config: IApiConfig) {
        super();
    }

    public async postConstruct(): Promise<any> {
        this.client = this.connect();
    }

    private connect() {
        return new Minio.Client(this.config.minio);
    }

    public async storeDocument(username: string, path: string, content: Buffer): Promise<any> {
        const formatIsAllowed = await DataFormatHelper.isDataFormatAllowed(content, path);
        if (!formatIsAllowed) {
            return Promise.reject(new Error('Forbidden format'));
        }

        const bucketName = this.bucketNameFromUsername(username);

        const metadata = {createdAt: new Date()};
        return this.client.putObject(bucketName, path, content, content.length, metadata);
    }

    public async storeCache(username: string, originalPath: string, content: Buffer): Promise<any> {
        const bucketName = this.bucketNameFromUsername(username);
        const path = this.cachePathForPath(originalPath);
        const metadata = {createdAt: new Date()};

        return this.client.putObject(bucketName, path, content, content.length, metadata);
    }

    public listDocuments(username: string): Promise<IDocument[]> {
        return new Promise((resolve, reject) => {
            const data: BucketItem[] = [];
            const stream = this.client.listObjectsV2(this.bucketNameFromUsername(username), '', true)
                .on('data', (obj: BucketItem) => {
                    data.push(obj);
                })
                .on('end' as any, (obj: BucketItem) => { // no end event in TS typings
                    resolve(this.bucketItemsToDocuments(data));
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
    }

    private bucketItemsToDocuments(data: BucketItem[]): IDocument[] {
        return _.map(data, bitem => ({
            name: bitem.name,
            prefix: bitem.prefix,
            size: bitem.size,
            etag: bitem.etag,
            lastModified: bitem.lastModified.toString(),
        }));
    }

    public async createStorageForUsername(username: string): Promise<string> {
        const bucketName = this.bucketNameFromUsername(username);
        await this.client.makeBucket(bucketName, DatastoreService.REGION);
        return bucketName;
    }

    private bucketNameFromUsername(username: string): string {
        return `user-data.${username}`;
    }

    private cachePathForPath(originalPath: string): string {
        return originalPath + '.cache';
    }

}
