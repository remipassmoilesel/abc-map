import {MapClient} from "./MapClient";
import {ProjectClient} from "./ProjectClient";
import {Ipc} from "../../../api/ipc/Ipc";

export class Clients {
    private _map: MapClient;
    private _project: ProjectClient;
    private ipc: Ipc;

    constructor() {
        this.ipc = new Ipc();
        this._map = new MapClient(this.ipc);
        this._project = new ProjectClient(this.ipc);
    }

    get map(): MapClient {
        return this._map;
    }

    set map(value: MapClient) {
        this._map = value;
    }

    get project(): ProjectClient {
        return this._project;
    }

    set project(value: ProjectClient) {
        this._project = value;
    }
}