import {Ipc, IpcHandler} from '../ipc/Ipc';
import {IpcSubject} from '../ipc/IpcSubject';
import {ProjectHandlers} from './ProjectHandlers';
import {MapHandlers} from './MapHandlers';
import {DatabaseHandlers} from './DatabaseHandlers';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';
import {IServicesMap} from '../services/IServiceMap';

export interface IHandlersMap{
    project: ProjectHandlers;
    map: MapHandlers;
    db: DatabaseHandlers;
}

export abstract class AbstractHandlersGroup extends AbstractServiceConsumer {
    protected ipc: Ipc;

    constructor(ipc: Ipc, services: IServicesMap) {
        super(services);
        this.ipc = ipc;
    }

    protected registerHandler(subject: IpcSubject, handler: IpcHandler) {
        this.ipc.listen(subject, handler);
    }

    public abstract onAppExit(): Promise<void>;

}
