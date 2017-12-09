import {Ipc} from "../ipc/Ipc";
import {IpcSubject} from "../ipc/IpcSubject";
import {AbstractHandlersGroup, IServicesMap} from "./AbstractHandlersGroup";

export class DatabaseHandlers extends AbstractHandlersGroup {

    constructor(ipc: Ipc, services: IServicesMap) {
        super(ipc, services);

        this.registerHandler(IpcSubject.DB_START, this.startDb.bind(this));
        this.registerHandler(IpcSubject.DB_STOP, this.stopDb.bind(this));
        this.registerHandler(IpcSubject.DB_RESTART, this.restartDb.bind(this));
        this.registerHandler(IpcSubject.DB_GET_LAYER_GEOJSON_DATA, this.getLayerData);
    }

    public startDb() {
        this.services.db.startDatabase();
    }

    public stopDb() {
        this.services.db.stopDatabase();
    }

    public restartDb() {
        this.services.db.stopDatabase();
    }

    public getLayerData() {

    }
}
