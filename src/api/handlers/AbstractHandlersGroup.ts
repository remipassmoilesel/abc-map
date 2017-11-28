import {Ipc} from "../ipc/Ipc";
import {ProjectService} from "../services/ProjectService";
import {MapService} from "../services/MapService";
import {DatabaseService} from "../services/DatabaseService";

export interface IServicesMap {
    project: ProjectService;
    map: MapService;
    db: DatabaseService;
}

export abstract class AbstractHandlersGroup {

    public abstract init(ipc: Ipc, services: IServicesMap);

}