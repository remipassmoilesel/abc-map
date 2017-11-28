import {Ipc} from "../ipc/Ipc";
import {IpcSubjects} from "../ipc/IpcSubjects";
import {IpcEvent} from "../ipc/IpcEvent";
import {AbstractMapLayer} from "../entities/layers/AbstractMapLayer";
import {AbstractHandlersGroup, IServicesMap} from "./AbstractHandlersGroup";

export class ProjectHandlers extends AbstractHandlersGroup {

    public init(ipc: Ipc, services: IServicesMap) {


        ipc.listen(IpcSubjects.PROJECT_CREATE_NEW, () => {
            return services.project.newProject();
        });

        ipc.listen(IpcSubjects.PROJECT_GET_CURRENT, () => {
            return services.project.getCurrentProject();
        });

        ipc.listen(IpcSubjects.PROJECT_ADD_LAYER, (event: IpcEvent) => {
            return services.project.addLayer(event.data);
        });

        ipc.listen(IpcSubjects.PROJECT_DELETE_LAYERS, (event: IpcEvent) => {
            return services.project.deleteLayers(event.data);
        });

    }

}
