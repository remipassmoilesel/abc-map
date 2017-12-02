import {Ipc} from "../ipc/Ipc";
import {IpcSubject} from "../ipc/IpcSubject";
import {IpcEvent} from "../ipc/IpcEvent";
import {AbstractHandlersGroup, IServicesMap} from "./AbstractHandlersGroup";

export class ProjectHandlers extends AbstractHandlersGroup {

    constructor(ipc: Ipc, services: IServicesMap) {
        super(ipc, services);

        this.registerHandler(IpcSubject.PROJECT_CREATE_NEW, this.createNewProject);
        this.registerHandler(IpcSubject.PROJECT_GET_CURRENT, this.getCurrentProject);
        this.registerHandler(IpcSubject.PROJECT_ADD_LAYER, this.addLayer);
        this.registerHandler(IpcSubject.PROJECT_DELETE_LAYERS, this.deleteLayer);
    }

    public createNewProject() {
        this.services.project.newProject();
        this.services.project.addLayer(this.services.map.getDefaultWmsLayers()[0]);
    }

    public getCurrentProject() {
        return this.services.project.getCurrentProject();
    }

    public addLayer(event: IpcEvent) {
        return this.services.project.addLayer(event.data);
    }

    public deleteLayer(event: IpcEvent) {
        return this.services.project.deleteLayers(event.data);
    }


}
