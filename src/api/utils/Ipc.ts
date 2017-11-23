import promiseIpc from 'electron-promise-ipc';

export class IpcSubjects {

    public static PROJECT_CREATE_NEW = new IpcSubjects('PROJECT_CREATE_NEW');
    public static PROJECT_GET_CURRENT = new IpcSubjects('PROJECT_GET_CURRENT');

    public static MAP_GET_WMS_URLS = new IpcSubjects('MAP_GET_WMS_URLS');

    public id: string;

    constructor(id: string) {
        this.id = id;
    }
}

export class Ipc {

    public listen(subject: IpcSubjects, handler: () => Promise<any>): void {
        promiseIpc.on(subject.id, handler);
    }

    public send(subject: IpcSubjects, data: any = {}): Promise<any> {
        return promiseIpc.send(subject.id, data);
    }

}