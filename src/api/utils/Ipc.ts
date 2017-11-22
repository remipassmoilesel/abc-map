import * as ipcPromise from 'ipc-promise';

export class IpcSubjects {

    public static MAP_GET_WMS_URLS = new IpcSubjects('MAP_GET_WMS_URLS');

    public id: string;

    constructor(id: string) {
        this.id = id;
    }
}

export class Ipc {

    public listen(subject: IpcSubjects, handler: () => Promise<any>): void {
        ipcPromise.on(subject.id, handler);
    }

    public send(subject: IpcSubjects, data?: any): Promise<any> {
        return ipcPromise.send(subject.id, data);
    }

}