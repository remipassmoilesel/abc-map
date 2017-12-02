import {Ipc, IpcHandler} from '../../../api/ipc/Ipc';
import {EntitiesUtils} from "../../../api/utils/EntitiesUtils";
import {Project} from "../../../api/entities/Project";
import {IpcSubject} from "../../../api/ipc/IpcSubject";
import {handleRejection} from "./clientUtils";
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import * as Promise from 'bluebird';

const eu = new EntitiesUtils();

export class ProjectClient {

    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public onProjectEvent(handler: IpcHandler): void {
        return this.ipc.listen(IpcSubject.PROJECT_EVENTS_BUS, handler);
    }

    public createNewProject(): Promise<void> {
        return this.ipc.send(IpcSubject.PROJECT_CREATE_NEW);
    }

    public getCurrentProject(): Promise<Project> {
        return this.ipc.send(IpcSubject.PROJECT_GET_CURRENT).catch(handleRejection);
    }

    public addLayer(layer: AbstractMapLayer) {
        return this.ipc.send(IpcSubject.PROJECT_ADD_LAYER, {data: layer}).catch(handleRejection);
    }

    public deleteLayers(layerIds: string[]) {
        return this.ipc.send(IpcSubject.PROJECT_DELETE_LAYERS, {data: layerIds}).catch(handleRejection);
    }
}
