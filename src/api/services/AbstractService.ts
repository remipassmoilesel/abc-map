import {Ipc} from '../ipc/Ipc';
import {IServicesMap} from '../handlers/AbstractHandlersGroup';

export abstract class AbstractService {

    protected ipc: Ipc;
    protected services: IServicesMap;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public abstract onAppExit(): Promise<void>;

    public setServiceMap(services: IServicesMap) {
        this.services = services;
    }
}
