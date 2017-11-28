import {Ipc} from "../ipc/Ipc";
import {ChildProcess, spawn} from 'child_process';
import {Logger} from "../dev/Logger";

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

        this.databaseStatus = DatabaseStatus.STOPPED;
        this.child.kill();
    }

    private spawnDatabaseProcess() {
        this.child = spawn('mongodb/bin/mongod -f config/mongodb-config.yaml');

        this.child.on('error', (err) => {
            logger.error(`Database processus error: ${err}`);
            this.restartDatabase();
        });

        this.child.on('exit', (err) => {
            logger.error(`Database processus exited: ${err}`);
            this.restartDatabase();
        });
    }

}