import * as chai from 'chai';
import * as sinon from 'sinon';
import {Ipc} from '../../ipc/Ipc';
import promiseIpc from 'electron-promise-ipc';
import {IpcSubject} from '../../ipc/IpcSubject';
import {IpcEvent} from '../../ipc/IpcEvent';

const assert = chai.assert;

describe.only('IpcTests', () => {

    const testSubject = new IpcSubject('test-subject');
    const promiseIpcOnStub = sinon.stub(promiseIpc, 'on');

    it('Responses returned from handler should be serialized', async () => {

        promiseIpcOnStub.resetBehavior();

        const ipc = new Ipc(promiseIpc);
        ipc.listen(testSubject, (arg: IpcEvent) => {
            assert.deepEqual(arg, {data: 'test-arg'});
            return 'test-response';
        });

        const subject = promiseIpcOnStub.getCall(0).args[0];
        const handler = promiseIpcOnStub.getCall(0).args[1];

        assert.deepEqual(subject, 'test-subject');

        const response = await handler({serializedData: '{"data": "test-arg"}'});
        assert.deepEqual(response, {serializedData: '"test-response"'});

    });

    it('Responses returned from handler in a promise should be serialized', async () => {

        promiseIpcOnStub.resetBehavior();
        promiseIpcOnStub.resetHistory();

        const ipc = new Ipc(promiseIpc);
        ipc.listen(testSubject, (arg: IpcEvent) => {
            assert.deepEqual(arg, {data: 'test-arg'});
            return new Promise((resolve, reject) => {
                setTimeout(resolve.bind(null, 'test-response'), 300);
            });
        });

        const subject = promiseIpcOnStub.getCall(0).args[0];
        const handler = promiseIpcOnStub.getCall(0).args[1];

        assert.deepEqual(subject, 'test-subject');

        const response = await handler({serializedData: '{"data": "test-arg"}'});
        assert.deepEqual(response, {serializedData: '"test-response"'});

    });

    it('If no response is returned from handler, an empty object should be serialized', async () => {

        promiseIpcOnStub.resetBehavior();
        promiseIpcOnStub.resetHistory();

        const ipc = new Ipc(promiseIpc);
        ipc.listen(testSubject, (arg: IpcEvent) => {
            assert.deepEqual(arg, {data: 'test-arg'});
            return;
        });

        const subject = promiseIpcOnStub.getCall(0).args[0];
        const handler = promiseIpcOnStub.getCall(0).args[1];

        assert.deepEqual(subject, 'test-subject');

        const response = await handler({serializedData: '{"data": "test-arg"}'});
        assert.deepEqual(response, {serializedData: '{}'});

    });

});
