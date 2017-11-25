import * as sinon from 'sinon';
import {Ipc} from "../../api/ipc/Ipc";

export class TestUtils {

    public static getStubbedIpc() {
        const ipc = new Ipc();
        return {
            listenStub: sinon.stub(ipc, 'listen'),
            sendStub: sinon.stub(ipc, 'send'),
            ipc
        }
    }

}