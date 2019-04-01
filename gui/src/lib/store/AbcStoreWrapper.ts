import {mainStore} from "@/lib/store/store";
import {ProjectActions} from "@/lib/store/ProjectStoreModule";
import {IMapLayer, IProject} from "../../../../shared/dist";

export class AbcStoreWrapper {
    public project = new ProjectStoreWrapper();
}

export class ProjectStoreWrapper {

    public updateProject(): Promise<void> {
        return mainStore.dispatch(ProjectActions.PROJECT_UPDATE);
    }

    public setCurrentProject(project: IProject) {
        return mainStore.dispatch(ProjectActions.PROJECT_UPDATE, project);
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

export const abcStorew = new AbcStoreWrapper();
