import {AbstractService} from '../lib/AbstractService';
import {IPostConstruct} from '../lib/IPostConstruct';
import {IApiConfig} from '../IApiConfig';
import * as Minio from 'minio';
import {BucketItem} from 'minio';
import {IDocument} from 'abcmap-shared';
import {Magic} from 'mmmagic';

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

    public connect() {
        return new Minio.Client(this.config.minio);
    }

    public async storeDocument(username: string, path: string, content: Buffer) {
        this.checkFileFormat(content);

        const bucketName = this.bucketNameFromUsername(username);
        const bucketExists = await this.client.bucketExists(bucketName);
        if (!bucketExists) {
            await this.client.makeBucket(bucketName, DatastoreService.REGION);
        }

        const metadata = {createdAt: new Date()};
        return this.client.putObject(bucketName, path, content, content.length, metadata);
    }

    public getDocuments(username: string): Promise<IDocument[]> {
        return new Promise((resolve, reject) => {
            const data: BucketItem[] = [];
            const stream = this.client.listObjectsV2(this.bucketNameFromUsername(username), '', true)
                .on('data', (obj: BucketItem) => {
                    data.push(obj);
                })
                .on('end' as any, (obj: BucketItem) => { // no end event in TS typings
                    resolve(data);
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
    }

    private bucketNameFromUsername(username: string): string {
        return `user-data.${username}`;
    }

    private checkFileFormat(data: Buffer) {
        const magic = new Magic();
        magic.detect(data, function(err, result) {
            if (err) {
                throw err;
            }
            console.log(result);
            // output on Windows with 32-bit node:
            //    PE32 executable (DLL) (GUI) Intel 80386, for MS Windows
        });
    }
}
