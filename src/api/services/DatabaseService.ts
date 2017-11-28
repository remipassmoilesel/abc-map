import {Ipc} from "../ipc/Ipc";
import {ChildProcess, exec} from 'child_process';
import {Logger} from "../dev/Logger";
import * as path from "path";
import * as fs from "fs-extra";
import * as assert from "assert";

const projectRoot: string = path.resolve(__dirname, '..', '..', '..');
assert.ok(fs.existsSync(projectRoot), 'Project root must exist');

const logger = Logger.getLogger('DatabaseService');

export enum DatabaseStatus {
    STARTED = 'STARTED',
    STOPPED = 'STOPPED',
}

export class DatabaseService {

    private ipc: Ipc;
    private child: ChildProcess;
    private databaseStatus: DatabaseStatus;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
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

    public stopDatabase() {
        logger.info('Stopping database ...');

        // FIXME: use mongo client
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

        this.child.on('exit', (err) => {
            logger.error(`Database process exited: ${err}`);
            this.restartDatabase();
        });
    }

}