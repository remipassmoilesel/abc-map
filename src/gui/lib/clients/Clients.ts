import {MapClient} from "./MapClient";
import {ProjectClient} from "./ProjectClient";
import {Ipc} from "../../../api/ipc/Ipc";
import {ShortcutClient} from "./ShortcutClient";

export class Clients {
    private _map: MapClient;
    private _project: ProjectClient;
    private ipc: Ipc;
    private _shortcuts: ShortcutClient;

    constructor() {
        this.ipc = new Ipc();
        this._map = new MapClient(this.ipc);
        this._project = new ProjectClient(this.ipc);
        this._shortcuts = new ShortcutClient(this.ipc);
    }

    get map(): MapClient {
        return this._map;
    }

    get project(): ProjectClient {
        return this._project;
    }

    get shortcuts(): ShortcutClient {
        return this._shortcuts;
    }

}