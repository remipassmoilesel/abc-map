import {AbstractService} from '../lib/AbstractService';
import {IPostConstruct} from '../lib/IPostConstruct';
import {IApiConfig} from '../IApiConfig';
import * as Minio from 'minio';

export class DatastoreService extends AbstractService implements IPostConstruct {

    private static readonly REGION = 'region1';

    private client!: Minio.Client;

    constructor(private config: IApiConfig) {
        super();
        this.client = this.connect();
    }

    public connect() {
        return new Minio.Client(this.config.minio);
    }

    public async storeObject(username: string, path: string, content: Buffer) {
        const bucketExists = await this.client.bucketExists(username);
        if (!bucketExists) {
            await this.client.makeBucket(username, DatastoreService.REGION);
        }

        const metadata = {createdAt: new Date()};
        return this.client.putObject(username, path, content, content.length, metadata);
    }

    private bucketNameFromUsername(username: string): string {
        return `user.${username}`;
    }

    private cleanPath(username: string): string {
        return `user.${username}`;
    }
}
