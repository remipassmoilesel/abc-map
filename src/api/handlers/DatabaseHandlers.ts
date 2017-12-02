import {Ipc} from "../ipc/Ipc";
import {IpcSubject} from "../ipc/IpcSubject";
import {AbstractHandlersGroup, IServicesMap} from "./AbstractHandlersGroup";

export class DatabaseHandlers extends AbstractHandlersGroup {

    constructor(ipc: Ipc, services: IServicesMap) {
        super(ipc, services);

        this.registerHandler(IpcSubject.DB_START, this.startDb);
        this.registerHandler(IpcSubject.DB_STOP, this.stopDb);
        this.registerHandler(IpcSubject.DB_RESTART, this.restartDb);
    }

    public startDb() {
        this.services.db.startDatabase();
    }

    public stopDb() {
        this.services.db.stopDatabase();
    };

    public restartDb() {
        this.services.db.stopDatabase();
    };

}
