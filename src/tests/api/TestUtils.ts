import * as sinon from 'sinon';
import * as mongodb from 'mongodb';
import {Ipc} from "../../api/ipc/Ipc";
import {Utils} from "../../api/utils/Utils";
import {DatabaseService} from "../../api/services/DatabaseService";

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


}