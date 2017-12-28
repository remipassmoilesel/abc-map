import * as chai from 'chai';
import * as sinon from 'sinon';
import {Ipc} from '../../ipc/Ipc';
import promiseIpc from 'electron-promise-ipc';
import {IpcSubject} from '../../ipc/IpcSubject';

const assert = chai.assert;

describe.only('IpcTests', () => {

    const testSubject = new IpcSubject('test-subject');

    it('Responses returned from handler should be serialized', async () => {

        const promiseIpcOnStub = sinon.stub(promiseIpc, 'on');
        const ipc = new Ipc(promiseIpc);
        ipc.listen(testSubject, (arg) => {
            return 'test';
        });

        const subject = promiseIpcOnStub.getCall(0).args[0];
        const handler = promiseIpcOnStub.getCall(0).args[1];

        assert.deepEqual(subject, 'test-subject');

        const response = await handler({serializedData: '{}'});
        assert.deepEqual(response, {serializedData: '"test"'});

    });

    it('Responses returned from handler in a promise should be serialized', () => {
        assert.fail();
    });

});
