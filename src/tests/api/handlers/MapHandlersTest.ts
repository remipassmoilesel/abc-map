import 'mocha';
import * as chai from 'chai';
import {Application} from 'spectron';
import * as electron from 'electron';
import {IpcSubject} from "../../../api/ipc/IpcSubject";
import {Ipc} from "../../../api/ipc/Ipc";

const assert = chai.assert;

// voir: https://github.com/StephenDavidson/electron-spectron-example/blob/master/test/search.js

describe.only('Map handlers', () => {

    let app: Application;

    beforeEach(() => {
        app = new Application({
            path: electron as any,
            args: ['.']
        });
        return app.start()
    });

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop()
        }
    });

    it('Send a message', () => {
        const ipc = new Ipc(app.electron.webContents);
        return ipc.send(IpcSubject.PROJECT_GET_CURRENT).then((data) => {
            console.log(data);
        });
    }).timeout(10000);

});
