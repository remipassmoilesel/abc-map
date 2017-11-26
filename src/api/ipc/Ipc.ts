import promiseIpc from 'electron-promise-ipc';
import {Subj} from "./IpcSubjects";
import {IpcEvent} from "./IpcEvent";
import {EntitiesUtils} from "../utils/EntitiesUtils";

export declare type IpcHandler = (event: IpcEvent) => Promise<any> | any;

export interface IpcMessage {
    data: string;
}

const eu = new EntitiesUtils();

/**
 * Inter process communication tool, allow to communicate between server (main process)
 * and client (renderer process) code.
 */
export class Ipc {
    private webContent: any;

    /**
     * Web content is mandatory if you want to use IPC from
     * server side
     *
     * @param webContent
     */
    constructor(webContent?: any) {
        this.webContent = webContent;
    }

    public listen(subject: Subj, handler: IpcHandler): void {
        promiseIpc.on(subject.id, (serialized) => {
            const event = eu.deserializeIpcEvent(serialized.data);
            return handler(event);
        });
    }

    public send(subject: Subj, event: IpcEvent = {}): Promise<any> {

        const serialized: IpcMessage = {data: eu.serialize(event)};

        if (this.webContent) {
            return promiseIpc.send(subject.id, this.webContent, serialized);
        }
        else {
            return promiseIpc.send(subject.id, serialized);
        }
    }

}

