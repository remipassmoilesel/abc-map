import {AbstractService} from '../lib/AbstractService';
import {IPostConstruct} from '../lib/IPostConstruct';
import {IApiConfig} from '../IApiConfig';
import Minio from 'minio';

export class DatastoreService extends AbstractService implements IPostConstruct {

    private client!: Minio.Client;

    constructor(private config: IApiConfig) {
        super();
        this.client = this.connect();
    }

    public connect() {
        return new Minio.Client(this.config.minio);
    }

}
