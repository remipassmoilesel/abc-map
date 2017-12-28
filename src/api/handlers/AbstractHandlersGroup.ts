import {Ipc, IpcHandler} from '../ipc/Ipc';
import {ProjectService} from '../services/ProjectService';
import {MapService} from '../services/MapService';
import {DatabaseService} from '../services/DatabaseService';
import {IpcSubject} from '../ipc/IpcSubject';
import {GlobalShortcutsService} from '../utils/GlobalShortcutsService';
import {ProjectHandlers} from './ProjectHandlers';
import {MapHandlers} from './MapHandlers';
import {DatabaseHandlers} from './DatabaseHandlers';

export interface IServicesMap {
    project: ProjectService;
    map: MapService;
    db: DatabaseService;
    shortcuts: GlobalShortcutsService;
}

export interface IHandlersMap{
    project: ProjectHandlers;
    map: MapHandlers;
    db: DatabaseHandlers;
}

export abstract class AbstractHandlersGroup {
    protected ipc: Ipc;
    protected services: IServicesMap;

    constructor(ipc: Ipc, services: IServicesMap) {
        this.ipc = ipc;
        this.services = services;
    }

    protected registerHandler(subject: IpcSubject, handler: IpcHandler) {
        this.ipc.listen(subject, handler);
    }

    public abstract onAppExit(): Promise<void>;

}
