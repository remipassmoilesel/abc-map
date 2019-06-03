import {DatastoreService} from './DatastoreService';
import * as fs from 'fs';
import {IApiConfig} from '../IApiConfig';
import {Logger} from 'loglevel';
import * as path from 'path';
import glob = require('glob');
import loglevel = require('loglevel');

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

        files.forEach(async filePath => {
            const fullPath = path.resolve(this.basePath, filePath);
            if (fs.statSync(fullPath).isDirectory()) {
                return true;
            }
            const publicPath = 'public/' + filePath;
            const documentExists = await this.datastore.documentExists(publicPath);
            if (!documentExists) {
                this.uploadFile(fullPath, publicPath);
            } else {
                this.logger.info(`Document already exists, and will not be imported again: ${publicPath}`);
            }
        });
    }

    private uploadFile(localPath: string, publicPath: string) {
        const content = fs.readFileSync(localPath);

        this.logger.info(`Importing: ${publicPath}`);

        this.datastore.storeDocument('public', publicPath, content)
            .catch(err => this.logger.error(`Error while storing file. document=${publicPath}`, err));
        this.datastore.cacheDocumentAsGeojson(publicPath, content)
            .catch(err => this.logger.error(`Error while caching file. document=${publicPath}`, err));
    }
}
