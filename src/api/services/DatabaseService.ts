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
        logger.info('Restarting database ...');

        // do not restart database if it was stopped
        if (this.databaseStatus !== DatabaseStatus.STOPPED) {
            setTimeout(() => {
                this.spawnDatabaseProcess();
            }, 1000);
        }

    }

    public stopDatabase(): Promise<any> {
        logger.info('Stopping database ...');
        this.databaseStatus = DatabaseStatus.STOPPED;

        return (mongodb.connect(`mongodb://localhost:${DatabaseService.PORT}/admin`)
            .then((db) => {
                logger.info('connected as admin');
                return db.command({shutdown: 1});
            }).catch((e)=>{
                console.error('', e);
            }) as Promise<any>);
    }

    private spawnDatabaseProcess() {

        this.child = exec('./mongodb/bin/mongod -f config/mongodb-config.yaml',
            {cwd: projectRoot});

        this.child.on('error', (err) => {
            logger.error(`Database process error: ${err}`);
            this.restartDatabase();
        });

        this.child.on('exit', (err) => {
            logger.error(`Database process exited: ${err}`);
            this.restartDatabase();
        });

    }

}