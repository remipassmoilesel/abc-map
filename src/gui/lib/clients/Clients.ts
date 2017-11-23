import {MapClient} from "./MapClient";
import {ProjectClient} from "./ProjectClient";

export class Clients {
    private _mapClient: MapClient;
    private _projectClient: ProjectClient;

    constructor() {
        this._mapClient = new MapClient();
        this._projectClient = new ProjectClient();
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