import { Project } from '@abc-map/shared-entities';
import { ProjectHelper } from '../../core/ProjectHelper';

export interface ProjectState {
  current?: Project;
}

export const projectInitialState: ProjectState = {
  current: ProjectHelper.emptyProject(),
};
