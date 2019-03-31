import {mainStore} from "@/lib/store/store";
import {ProjectActions} from "@/lib/store/ProjectStoreModule";
import {IMapLayer, IProject} from "../../../../shared/dist";

export class StoreWrapper {
    public project = new ProjectStoreWrapper();
}

export class ProjectStoreWrapper {

    public updateProject(): Promise<void> {
        return mainStore.dispatch(ProjectActions.PROJECT_UPDATE);
    }

    public getCurrentProject(): IProject | null {
        return mainStore.state.project.currentProject;
    }

    public getProjectLayers(): IMapLayer[] {
        return mainStore.getters.projectLayers;
    }

    public getProjectName(): string {
        return mainStore.getters.projectName;
    }

}
