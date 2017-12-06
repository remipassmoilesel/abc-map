import {Ipc} from "../ipc/Ipc";
import {ChildProcess, exec} from 'child_process';
import {Logger} from "../dev/Logger";
import * as path from "path";
import * as fs from "fs-extra";
import * as assert from "assert";
import * as mongodb from "mongodb";
import {Db} from "mongodb";
import {Utils} from "../utils/Utils";
import * as Promise from "bluebird";

const projectRoot: string = path.resolve(__dirname, '..', '..', '..');
assert.ok(fs.existsSync(projectRoot), 'Project root must exist');

const logger = Logger.getLogger('DatabaseService');

export enum DatabaseStatus {
    STARTED = 'STARTED',
    STOPPED = 'STOPPED',
}

export class DatabaseService {

    private static readonly PORT = '30001';
    private ipc: Ipc;
    private child: ChildProcess;
    private databaseStatus: DatabaseStatus;
    private db: Db;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public connect(): Promise<Db> {
        return Utils.retryUntilSuccess(() => {
            return (mongodb.connect(`mongodb://localhost:${DatabaseService.PORT}/abcmap`)
                .then((db) => {
                    this.db = db;
                }) as any);
        });
    }

    public startDatabase() {
        logger.info('Starting database ...');

        this.databaseStatus = DatabaseStatus.STARTED;
        this.spawnDatabaseProcess();
    }

    public restartDatabase() {

        // do not restart database if it was stopped
        if (this.databaseStatus !== DatabaseStatus.STOPPED) {

            logger.info('Restarting database ...');

            setTimeout(() => {
                this.spawnDatabaseProcess();
            }, 1000);
        }

    }

    public stopDatabase(): void {
        logger.info('Stopping database ...');
        this.databaseStatus = DatabaseStatus.STOPPED;

        this.child.kill();
    }

    private spawnDatabaseProcess() {

        this.child = exec('./mongodb/bin/mongod -f config/mongodb-config.yaml',
            {cwd: projectRoot});

        this.child.on('error', (err) => {
            logger.error(`Database process error: ${err}`);
            this.restartDatabase();
        });

        this.child.on('exit', () => {
            logger.error(`Database process exited`);
            this.restartDatabase();
        });

    }

}