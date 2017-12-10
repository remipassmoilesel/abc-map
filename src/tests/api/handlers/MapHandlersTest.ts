import 'mocha';
import * as chai from 'chai';
import {IpcSubject} from "../../../api/ipc/IpcSubject";
import {Ipc} from "../../../api/ipc/Ipc";
import {Logger} from "../../../api/dev/Logger";
import {Application} from "spectron";
import {TestUtils} from "../TestUtils";

const logger = Logger.getLogger('MapHandlersTest');
const assert = chai.assert;

// voir: https://github.com/StephenDavidson/electron-spectron-example/blob/master/test/search.js

describe.only('Map handlers', function () {

    this.timeout(10000);

    let app: Application;

    beforeEach(() => {
        return TestUtils.startApplication().then((newApp) => {
            app = newApp;
        });
    });

    afterEach(() => {
        if (app && app.isRunning()) {
            logger.info('Stopping application');
            return app.stop();
        }
    });

    it('Send a message', () => {

        logger.info('app', app || 'undefined');
        logger.info('app.electron', app.electron || 'undefined');
        logger.info('app.mainProcess', app.mainProcess || 'undefined');

        const ipc = new Ipc(app.electron.webContents);
        return ipc.send(IpcSubject.PROJECT_GET_CURRENT).then((data) => {
            logger.info(data);
        });
    })

});
