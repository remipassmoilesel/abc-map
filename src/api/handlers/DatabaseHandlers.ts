import {Ipc} from "../ipc/Ipc";
import {IpcSubjects} from "../ipc/IpcSubjects";
import {IpcEvent} from "../ipc/IpcEvent";
import {AbstractMapLayer} from "../entities/layers/AbstractMapLayer";
import {AbstractHandlersGroup, IServicesMap} from "./AbstractHandlersGroup";

export class DatabaseHandlers extends AbstractHandlersGroup {

    public init(ipc: Ipc, services: IServicesMap) {

        ipc.listen(IpcSubjects.DB_START, () => {
            services.db.startDatabase();
        });

        ipc.listen(IpcSubjects.DB_STOP, () => {
            services.db.stopDatabase();
        });

        ipc.listen(IpcSubjects.DB_RESTART, () => {
            services.db.stopDatabase();
        });

    }

}
