import promiseIpc from 'electron-promise-ipc';
import {IpcSubject} from './IpcSubject';
import {IpcEvent} from './IpcEvent';
import {EntitySerializerFactory} from '../entities/serializer/EntitySerializerFactory';
import {Logger, LogLevel} from '../dev/Logger';

const logger = Logger.getLogger('Ipc');
logger.setLevel(LogLevel.WARNING);

const eu = EntitySerializerFactory.newInstance();

export declare type IpcHandler = (event: IpcEvent) => any;

/**
 * Raw IPC message containing only serialized data
 * This kind of message allow to restore true objects
 * (with class types) when receiving them
 */
export interface IpcInternalMessage {
    serializedData: string;
}

/**
 * Inter process communication tool, allow to communicate between main process
 * and renderer process.
 */
export class Ipc {

    public static newInstance(webContent?: any): Ipc {
        return new Ipc(promiseIpc, webContent);
    }

    private webContent: any;
    private promiseIpc: any;

    /**
     * Web content is mandatory if you want to use IPC from
     * main process
     *
     * @param promiseIpc
     * @param webContent
     */
    constructor(promiseIpc: any, webContent?: any) {
        logger.debug('New instance created');
        this.webContent = webContent;
        this.promiseIpc = promiseIpc;
    }

    /**
     * Register a handler. Handler should never return a promise.
     *
     * @param {IpcSubject} subject
     * @param {IpcHandler} handler
     */
    public listen(subject: IpcSubject, handler: IpcHandler): void {

        logger.debug(`Listening: subject=${JSON.stringify(subject)} handler=${JSON.stringify(handler)}`);

        this.promiseIpc.on(subject.id, async (message: IpcInternalMessage): Promise<IpcInternalMessage> => {

            logger.debug(`Message received: subject=${JSON.stringify(subject)} event=${JSON.stringify(message)}`);

            const event = eu.deserializeIpcEvent(message.serializedData || '{}');

            const response = handler(event);
            if (response) {
                return await this.serializeIpcMessage(response);
            }

            // no response returned
            else {
                return {serializedData: '{}'};
            }
        });
    }

    public send(subject: IpcSubject, event: IpcEvent = {}): Promise<any> {

        const serialized: IpcInternalMessage = {serializedData: eu.serialize(event || {})};

        logger.debug(`Send message: subject=${JSON.stringify(subject)} event=${JSON.stringify(event)}`);

        // send event from main process
        if (this.webContent) {
            return this.promiseIpc.send(subject.id, this.webContent, serialized)
                .then((message: IpcInternalMessage) => {
                    return this.deserializeIpcMessage(message);
                });
        }
        // send event from renderer process
        else {
            return this.promiseIpc.send(subject.id, serialized)
                .then((message: IpcInternalMessage) => {
                    return this.deserializeIpcMessage(message);
                });
        }
    }

    private deserializeIpcMessage(message: IpcInternalMessage) {
        return eu.deserialize(message && message.serializedData || '{}');
    }

    private async serializeIpcMessage(data: any): Promise<IpcInternalMessage> {

        // all responses, even undefined, should return at least an empty object

        // response is a promise
        if (data.then) {
            const response = await data;
            return {serializedData: eu.serialize(response || {})};
        } else {
            return {serializedData: eu.serialize(data || {})};
        }

    }

}

