import {Ipc, IpcHandler} from "../ipc/Ipc";
import {ProjectService} from "../services/ProjectService";
import {MapService} from "../services/MapService";
import {DatabaseService} from "../services/DatabaseService";
import {IpcSubject} from "../ipc/IpcSubject";

export interface IServicesMap {
    project: ProjectService;
    map: MapService;
    db: DatabaseService;
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

}