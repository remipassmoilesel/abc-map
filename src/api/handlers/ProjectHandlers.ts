import {Ipc} from "../ipc/Ipc";
import {ProjectSubjects} from "../ipc/IpcSubject";
import {IpcEvent} from "../ipc/IpcEvent";
import {AbstractHandlersGroup, IServicesMap} from "./AbstractHandlersGroup";

export class ProjectHandlers extends AbstractHandlersGroup {

    constructor(ipc: Ipc, services: IServicesMap) {
        super(ipc, services);

        this.registerHandler(ProjectSubjects.CREATE_NEW, this.createNewProject.bind(this));
        this.registerHandler(ProjectSubjects.GET_CURRENT, this.getCurrentProject.bind(this));
        this.registerHandler(ProjectSubjects.ADD_LAYER, this.addLayer.bind(this));
        this.registerHandler(ProjectSubjects.DELETE_LAYERS, this.deleteLayer.bind(this));
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
