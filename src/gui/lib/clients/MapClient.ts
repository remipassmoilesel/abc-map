import {Ipc, IpcSubjects} from "../../../api/utils/Ipc";

export class MapClient {

    private ipc: Ipc;

    constructor() {
        this.ipc = new Ipc();
    }

    public getWmsUrls(): Promise<string[]> {
        return this.ipc.send(IpcSubjects.MAP_GET_WMS_URLS);
    }

}