import {mainStore} from '@/lib/store/store';
import {ProjectActions} from '@/lib/store/AbcProjectStoreModule';
import {IMapLayer, IProject} from '../../../../shared/dist';
import {GuiActions} from '@/lib/store/AbcGuiStoreModule';

export class AbcStoreWrapper {
    public project = new ProjectStoreWrapper();
    public gui = new GuiStoreWrapper();
}

class ProjectStoreWrapper {

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

class GuiStoreWrapper {

    public setProjectNotFoundModalVisible(value: boolean): Promise<void> {
        return mainStore.dispatch(GuiActions.PROJECT_NOT_FOUND_MODAL_VISIBLE, value);
    }

    public getProjectNotFoundModalState(): boolean {
        return mainStore.state.gui.modals.projectNotFound;
    }
}

export const abcStorew = new AbcStoreWrapper();
