import {Ipc, IpcHandler} from '../../../api/ipc/Ipc';
import {EntitiesUtils} from "../../../api/utils/EntitiesUtils";
import {Project} from "../../../api/entities/Project";
import {Subj} from "../../../api/ipc/IpcSubjects";

export class ProjectClient {

    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public onProjectEvent(handler: IpcHandler) {
        return this.ipc.listen(Subj.PROJECT_EVENTS_BUS, handler);
    }

    public createNewProject(): Promise<void> {
        return this.ipc.send(Subj.PROJECT_CREATE_NEW);
    }

    public getCurrentProject(): Promise<Project> {
        return this.ipc.send(Subj.PROJECT_GET_CURRENT).then((data) => {
            return EntitiesUtils.parseFromRaw(Project.prototype, data);
        });
    }

}
