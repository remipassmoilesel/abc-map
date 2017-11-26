import promiseIpc from 'electron-promise-ipc';
import {Subj} from "./IpcSubjects";
import {IpcEvent} from "./IpcEvent";
import {EntitiesUtils} from "../utils/EntitiesUtils";

const eu = new EntitiesUtils();

export declare type IpcHandler = (event: IpcEvent) => any;

/**
 * Raw IPC message containing only serialized data
 * This kind of message allow to restore true objects
 * (with class types) when receiving them
 */
interface IpcMessage {
    serializedData: string;
}

/**
 * Inter process communication tool, allow to communicate between main process
 * and renderer process.
 */
export class Ipc {
    private webContent: any;

    /**
     * Web content is mandatory if you want to use IPC from
     * main process
     *
     * @param webContent
     */
    constructor(webContent?: any) {
        this.webContent = webContent;
    }

    /**
     * Register a handler. Handler should never return a promise.
     *
     * @param {Subj} subject
     * @param {IpcHandler} handler
     */
    public listen(subject: Subj, handler: IpcHandler): void {
        promiseIpc.on(subject.id, (message: IpcMessage) => {
            this.throwIfMessageIsInvalid(message);
            const event = eu.deserializeIpcEvent(message.serializedData);
            return this.serializeResponse(handler(event));
        });
    }

    public send(subject: Subj, event: IpcEvent = {}): Promise<any> {

        const serialized: IpcMessage = {serializedData: eu.serialize(event)};

        // send event from main process
        if (this.webContent) {
            return promiseIpc.send(subject.id, this.webContent, serialized)
                .then((message: IpcMessage) => {
                    return this.deserializeIpcMessage(message);
                });
        }
        // send event from renderer process
        else {
            return promiseIpc.send(subject.id, serialized)
                .then((message: IpcMessage) => {
                    return this.deserializeIpcMessage(message);
                });
        }
    }

    private deserializeIpcMessage(message: IpcMessage) {
        this.throwIfMessageIsInvalid(message);
        return eu.deserialize(message.serializedData);
    }

    private serializeResponse(data: any): IpcMessage {
        return {serializedData: eu.serialize(data)};
    }

    private throwIfMessageIsInvalid(message: IpcMessage) {
        if (!message.serializedData) {
            throw new Error(`Invalid message: ${message}`);
        }
    }
}

