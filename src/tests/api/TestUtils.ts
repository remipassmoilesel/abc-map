import * as sinon from 'sinon';
import * as mongodb from 'mongodb';
import * as path from 'path';
import {Ipc} from "../../api/ipc/Ipc";
import {Utils} from "../../api/utils/Utils";
import {DatabaseService} from "../../api/services/DatabaseService";
import {Logger} from "../../api/dev/Logger";
import * as electron from 'electron';
import {Application} from 'spectron';

const logger = Logger.getLogger('TestUtils');

export class TestUtils {

    public static getStubbedIpc() {
        const ipc = new Ipc();
        return {
            listenStub: sinon.stub(ipc, 'listen'),
            sendStub: sinon.stub(ipc, 'send'),
            ipc
        }
    }

    public static getMongodbConnection(): Promise<mongodb.Db> {

        const dbId = `abcmap-test`;
        const connectUri = `mongodb://localhost:${DatabaseService.SERVER_PORT}/${dbId}`;

        return Utils.retryUntilSuccess(() => {
            return (mongodb.connect(connectUri) as any);
        });
    }

    public static startApplication() {

        logger.info('Starting application');
        const app = new Application({
            path: electron as any,
            args: [path.resolve('./dist/electron-main.js')]
        });

        return app.start().then(() => {

            logger.info('Test application is launched');

            app.client.getMainProcessLogs().then(function (logs) {
                logs.forEach(function (log) {
                    logger.info(`[main] ${log}`);
                })
            });

            app.client.getRenderProcessLogs().then(function (logs) {
                logs.forEach(function (log) {
                    logger.info(`[renderer] ${log}`)
                })
            });

            return app;
        });
    }

}