import {AbcLocalStorageHelper, LSKey} from "@/lib/utils/AbcLocalStorageHelper";
import {AbcStoreWrapper} from "@/lib/store/AbcStoreWrapper";
import {IAbcApiClientMap} from "@/lib/IAbcApiClientMap";

export class ProjectService {

    constructor(private clients: IAbcApiClientMap,
                private storew: AbcStoreWrapper,
                private abcLocalst: AbcLocalStorageHelper) {

        setTimeout(this.initProject.bind(this), 200)
    }

    initProject(): Promise<any> {
        const storedProjectId = this.abcLocalst.get(LSKey.CURRENT_PROJECT_ID);
        if (!storedProjectId) {
            return this.createNewProject();
        } else {
            return this.openProject(storedProjectId)
        }
    }

    async createNewProject(): Promise<any> {
        const project = await this.clients.project.createNewProject("Nouveau projet");
        this.abcLocalst.save(LSKey.CURRENT_PROJECT_ID, project.id);
        return this.storew.project.setCurrentProject(project).then(res => project);
    }

    async openProject(projectId: string): Promise<any> {
        const project = await this.clients.project.findProjectById(projectId);
        this.abcLocalst.save(LSKey.CURRENT_PROJECT_ID, project.id);
        return this.storew.project.setCurrentProject(project).then(res => project);
    }

}
