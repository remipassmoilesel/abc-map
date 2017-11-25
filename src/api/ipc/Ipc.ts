import promiseIpc from 'electron-promise-ipc';
import {Subj} from "./IpcSubjects";
import {IpcEvent} from "./IpcEvent";

export declare type IpcHandler = (event: IpcEvent) => Promise<any>;

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
        promiseIpc.on(subject.id, handler);
    }

    public send(subject: Subj, event: IpcEvent = {}): Promise<any> {
        if (this.webContent) {
            return promiseIpc.send(subject.id, this.webContent, event);
        }
        else {
            return promiseIpc.send(subject.id, event);
        }
    }

}

