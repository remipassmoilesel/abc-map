import {Ipc, IpcSubjects} from '../../../api/utils/Ipc';
import {EntitiesUtils} from "../../../api/utils/EntitiesUtils";
import {Project} from "../../../api/entities/Project";

export class ProjectClient {

    private ipc: Ipc;

    constructor() {
        this.ipc = new Ipc();
    }

    public createNewProject(): Promise<void> {
        return this.ipc.send(IpcSubjects.PROJECT_CREATE_NEW);
    }

    public getCurrentProject(): Promise<Project> {
        return this.ipc.send(IpcSubjects.PROJECT_GET_CURRENT).then((data) => {
            return EntitiesUtils.parseFromRaw(Project.prototype, data);
        });
    }

}
