import {DatastoreService} from './DatastoreService';
import * as fs from 'fs';
import {IApiConfig} from '../IApiConfig';
import {Logger} from 'loglevel';
import glob = require('glob');
import loglevel = require('loglevel');
import * as path from "path";

export class DatastoreInit {

    protected logger: Logger = loglevel.getLogger('DatastoreInit');
    private basePath: string;

    constructor(private datastore: DatastoreService,
                apiConfig: IApiConfig) {
        this.basePath = apiConfig.publicDir.rootPath;
    }

    public async init(): Promise<void> {
        return this.importFromPublicDir();
    }

    private async importFromPublicDir(): Promise<void> {
        const files = glob.sync('**', {
            cwd: this.basePath,
        });

        files.forEach(filePath => {
            const fullPath = path.resolve(this.basePath, filePath);
            if (fs.statSync(fullPath).isDirectory()) {
                return true;
            }

            const content = fs.readFileSync(fullPath);
            const docPath = 'public/' + filePath;

            this.logger.info(`Importing: ${docPath}`);

            this.datastore.storeDocument('public', docPath, content)
                .catch(err => this.logger.error(`Error while storing file. document=${docPath}`, err));
            this.datastore.cacheDocumentAsGeojson(docPath, content)
                .catch(err => this.logger.error(`Error while caching file. document=${docPath}`, err));
        });
    }
}
