import {Ipc} from "../ipc/Ipc";
import {ChildProcess, exec, execSync} from 'child_process';
import {Logger} from "../dev/Logger";
import * as path from "path";
import * as fs from "fs-extra";
import * as assert from "assert";
import * as mongodb from "mongodb";
import {Db} from "mongodb";
import {Utils} from "../utils/Utils";
import {GeoJsonDao} from "../database/GeoJsonDao";
import {AbstractService} from "./AbstractService";
import {ProjectDao} from "../database/ProjectDao";

const projectRoot: string = path.resolve(__dirname, '..', '..', '..');
assert.ok(fs.existsSync(projectRoot), 'Project root must exist');

const logger = Logger.getLogger('DatabaseService');

export enum DatabaseStatus {
    STARTED = 'STARTED',
    STOPPED = 'STOPPED',
}

export class DatabaseService extends AbstractService {

    public static readonly SERVER_PORT = '30001';

    private child: ChildProcess;
    private databaseStatus: DatabaseStatus;
    private db: Db;
    private geoJsonDao: GeoJsonDao;
    private projectDao: ProjectDao;
    private databaseName: string;

    constructor(ipc: Ipc, databaseName: string) {
        super(ipc);
        this.databaseName = databaseName;

        logger.info('Initialize DatabaseService');
    }

    public connect(): Promise<Db> {
        return Utils.retryUntilSuccess(async () => {
            this.db = await mongodb.connect(
                `mongodb://localhost:${DatabaseService.SERVER_PORT}/${this.databaseName}`);
            this.initDao();
        });
    }

    public startDatabase() {
        logger.info('Starting database ...');

        this.databaseStatus = DatabaseStatus.STARTED;
        this.spawnDatabaseProcess();
    }

    public restartDatabaseLater() {

        logger.info('Restarting database ...');

        setTimeout(() => {
            this.spawnDatabaseProcess();
        }, 1000);

    }

    public stopDatabase(): void {
        logger.info('Stopping database ...');
        this.databaseStatus = DatabaseStatus.STOPPED;

        execSync('./mongodb/bin/mongod -f config/mongodb-config.yaml --shutdown', {cwd: projectRoot});
    }

    public getGeoJsonDao(): GeoJsonDao {
        return this.geoJsonDao;
    }

    public getProjectDao(): ProjectDao {
        return this.projectDao;
    }

    private spawnDatabaseProcess() {
        this.child = exec('./mongodb/bin/mongod -f config/mongodb-config.yaml', {cwd: projectRoot});
        this.child.on('exit', this.handleDatabaseProcessExit.bind(this));
    }

    private handleDatabaseProcessExit(code: number) {
        logger.error(`Database process exited with code ${code}`);

        // do not restart database if it was stopped
        if (this.databaseStatus !== DatabaseStatus.STOPPED) {
            this.restartDatabaseLater();
        }
    }

    private initDao() {
        this.geoJsonDao = new GeoJsonDao(this.db);
        this.projectDao = new ProjectDao(this.db);
    }

}