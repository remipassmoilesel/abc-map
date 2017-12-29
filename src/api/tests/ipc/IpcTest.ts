import * as chai from 'chai';
import * as sinon from 'sinon';
import {Ipc, IpcInternalMessage} from '../../ipc/Ipc';
import promiseIpc from 'electron-promise-ipc';
import {IpcSubject} from '../../ipc/IpcSubject';
import {IpcEvent} from '../../ipc/IpcEvent';

const assert = chai.assert;

describe('IpcTest', () => {

    const testSubject = new IpcSubject('test-subject');
    const promiseIpcOnStub = sinon.stub(promiseIpc, 'on');
    const promiseIpcSendStub = sinon.stub(promiseIpc, 'send');

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

        const response = await handler({serializedData: '{"data": "test-arg"}'} as IpcInternalMessage);
        assert.deepEqual(response, {serializedData: '"test-response"'} as IpcInternalMessage);

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

        const response = await handler({serializedData: '{"data": "test-arg"}'} as IpcInternalMessage);
        assert.deepEqual(response, {serializedData: '"test-response"'} as IpcInternalMessage);

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

        const response = await handler({serializedData: '{"data": "test-arg"}'} as IpcInternalMessage);
        assert.deepEqual(response, {serializedData: '{}'} as IpcInternalMessage);

    });

    it('On message sent, should serialize emitted object and response', async () => {

        promiseIpcSendStub.resetBehavior();
        promiseIpcSendStub.resetHistory();

        promiseIpcSendStub.onFirstCall()
            .returns(Promise.resolve({serializedData: '{"data":"test-response"}'} as IpcInternalMessage));

        const ipc = new Ipc(promiseIpc);
        const response = await ipc.send(testSubject, {data: 'test-data'} as IpcEvent);

        assert.deepEqual(promiseIpcSendStub.getCall(0).args[0], testSubject.id);
        assert.deepEqual(promiseIpcSendStub.getCall(0).args[1],
            {serializedData: '{"data":"test-data","#constructor":"Object"}'});
        assert.deepEqual(response, {data: 'test-response'} as IpcEvent);

    });

    it('On message sent, should serialize emitted object even if message is empty', async () => {

        promiseIpcSendStub.resetBehavior();
        promiseIpcSendStub.resetHistory();

        promiseIpcSendStub.onFirstCall().returns(Promise.resolve());

        const ipc = new Ipc(promiseIpc);
        const response = await ipc.send(testSubject);

        assert.deepEqual(promiseIpcSendStub.getCall(0).args[0], testSubject.id);
        assert.deepEqual(promiseIpcSendStub.getCall(0).args[1], {serializedData: '{"#constructor":"Object"}'});
        assert.deepEqual(response, {} as IpcEvent);

    });

});
