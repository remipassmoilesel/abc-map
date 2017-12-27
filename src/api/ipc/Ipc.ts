import promiseIpc from 'electron-promise-ipc';
import {IpcSubject} from './IpcSubject';
import {IpcEvent} from './IpcEvent';
import {EntitySerializer} from '../entities/serializer/EntitySerializer';
import {EntitySerializerFactory} from "../entities/serializer/EntitySerializerFactory";

const eu = EntitySerializerFactory.newInstance();

export declare type IpcHandler = (event: IpcEvent) => any;

/**
 * Raw IPC message containing only serialized data
 * This kind of message allow to restore true objects
 * (with class types) when receiving them
 */
interface IpcInternalMessage {
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
     * @param {IpcSubject} subject
     * @param {IpcHandler} handler
     */
    public listen(subject: IpcSubject, handler: IpcHandler): void {
        promiseIpc.on(subject.id, (message: IpcInternalMessage): IpcInternalMessage => {
            this.throwIfMessageIsInvalid(message);
            const event = eu.deserializeIpcEvent(message.serializedData);

            const response = handler(event);
            if (response) {
                return this.serializeResponse(response);
            } else {
                return {serializedData: '{}'};
            }
        });
    }

    public send(subject: IpcSubject, event: IpcEvent = {}): Promise<any> {

        const serialized: IpcInternalMessage = {serializedData: eu.serialize(event)};

        // send event from main process
        if (this.webContent) {
            return promiseIpc.send(subject.id, this.webContent, serialized)
                .then((message: IpcInternalMessage) => {
                    return this.deserializeIpcMessage(message);
                });
        } else {
            return promiseIpc.send(subject.id, serialized)
                .then((message: IpcInternalMessage) => {
                    return this.deserializeIpcMessage(message);
                });
        }
    }

    private deserializeIpcMessage(message: IpcInternalMessage) {
        this.throwIfMessageIsInvalid(message);
        return eu.deserialize(message.serializedData);
    }

    private serializeResponse(data: any): IpcInternalMessage {

        // response is a promise
        if (data.then) {
            return data.then((result) => {
                return {serializedData: eu.serialize(result)};
            });
        } else {
            return {serializedData: eu.serialize(data)};
        }

    }

    private throwIfMessageIsInvalid(message: IpcInternalMessage) {
        if (!message || !message.serializedData) {
            throw new Error(`Invalid message: ${message}`);
        }
    }
}

