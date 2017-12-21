import {MapClient} from './MapClient';
import {ProjectClient} from './ProjectClient';
import {Ipc} from '../../../api/ipc/Ipc';
import {GlobalShortcutsClient} from './GlobalShortcutsClient';

export class Clients {
    private _map: MapClient;
    private _project: ProjectClient;
    private ipc: Ipc;
    private _shortcuts: GlobalShortcutsClient;

    constructor() {
        this.ipc = new Ipc();
        this._map = new MapClient(this.ipc);
        this._project = new ProjectClient(this.ipc);
        this._shortcuts = new GlobalShortcutsClient(this.ipc);
    }

    get map(): MapClient {
        return this._map;
    }

    get project(): ProjectClient {
        return this._project;
    }

    get shortcuts(): GlobalShortcutsClient {
        return this._shortcuts;
    }

}
