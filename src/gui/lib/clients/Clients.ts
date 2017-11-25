import {MapClient} from "./MapClient";
import {ProjectClient} from "./ProjectClient";
import {Ipc} from "../../../api/ipc/Ipc";

export class Clients {
    private _mapClient: MapClient;
    private _projectClient: ProjectClient;
    private ipc: Ipc;

    constructor() {
        this.ipc = new Ipc();
        this._mapClient = new MapClient(this.ipc);
        this._projectClient = new ProjectClient(this.ipc);
    }

    get mapClient(): MapClient {
        return this._mapClient;
    }

    set mapClient(value: MapClient) {
        this._mapClient = value;
    }

    get projectClient(): ProjectClient {
        return this._projectClient;
    }

    set projectClient(value: ProjectClient) {
        this._projectClient = value;
    }
}