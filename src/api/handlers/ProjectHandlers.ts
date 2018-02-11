import {Ipc} from '../ipc/Ipc';
import {ProjectSubjects} from '../ipc/IpcSubject';
import {IpcEvent} from '../ipc/IpcEvent';
import {AbstractHandlersGroup} from './AbstractHandlersGroup';
import {Logger} from '../dev/Logger';
import {Project} from '../entities/Project';
import {TestData} from '../tests/TestData';
import {IServicesMap} from '../services/IServiceMap';

const logger = Logger.getLogger('ProjectHandlers');

export class ProjectHandlers extends AbstractHandlersGroup {

    constructor(ipc: Ipc, services: IServicesMap) {
        super(ipc, services);

        this.registerHandler(ProjectSubjects.CREATE_NEW, this.createNewProject.bind(this));
        this.registerHandler(ProjectSubjects.GET_CURRENT, this.getCurrentProject.bind(this));
        this.registerHandler(ProjectSubjects.ADD_LAYER, this.addLayer.bind(this));
        this.registerHandler(ProjectSubjects.DELETE_LAYERS, this.deleteLayer.bind(this));
        this.registerHandler(ProjectSubjects.ACTIVE_LAYER, this.setActiveLayer.bind(this));
   }

    public async createNewProject() {
        this.services.project.createNewProject();
    }

    public getCurrentProject() {
        return this.services.project.getCurrentProject();
    }

    public setActiveLayer(event: IpcEvent) {
        return this.services.project.setActiveLayer(event.data);
    }

    public addLayer(event: IpcEvent) {
        return this.services.project.addLayer(event.data);
    }

    public deleteLayer(event: IpcEvent) {
        return this.services.project.deleteLayers(event.data);
    }

    public saveProjectAs(event: IpcEvent) {
        return Promise.resolve();
    }

    public onAppExit(): Promise<void> {
        return Promise.resolve();
    }

}
