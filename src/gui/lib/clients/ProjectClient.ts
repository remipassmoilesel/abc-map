import {Ipc, IpcHandler} from '../../../api/ipc/Ipc';
import {Project} from '../../../api/entities/Project';
import {handleRejection} from './clientUtils';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';
import {IpcEventBus, ProjectSubjects} from '../../../api/ipc/IpcSubject';

export class ProjectClient {

    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public onProjectEvent(handler: IpcHandler): void {
        return this.ipc.listen(IpcEventBus.PROJECT, handler);
    }

    public createNewProject(): Promise<void> {
        return this.ipc.send(ProjectSubjects.CREATE_NEW);
    }

    public getCurrentProject(): Promise<Project> {
        return this.ipc.send(ProjectSubjects.GET_CURRENT).catch(handleRejection);
    }

    public addLayer(layer: AbstractMapLayer) {
        console.log('addLayer');
        console.log(layer);
        return this.ipc.send(ProjectSubjects.ADD_LAYER, {data: layer}).catch(handleRejection);
    }

    public deleteLayers(layerIds: string[]) {
        return this.ipc.send(ProjectSubjects.DELETE_LAYERS, {data: layerIds}).catch(handleRejection);
    }
}
