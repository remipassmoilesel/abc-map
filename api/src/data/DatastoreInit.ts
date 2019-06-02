import {DatastoreService} from './DatastoreService';
import * as fs from 'fs';
import {IApiConfig} from '../IApiConfig';

export class DatastoreInit {

    constructor(private datastore: DatastoreService,
                private apiConfig: IApiConfig) {

    }

    public async init(): Promise<void> {
        return this.importFromPublicDir();
    }

    private async importFromPublicDir(): Promise<void> {
        fs.readdirSync(this.apiConfig.publicDir.rootPath).forEach(file => {
            console.log(file);
        });
    }
}
