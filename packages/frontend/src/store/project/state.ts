import { AbcProject } from '@abc-map/shared-entities';
import { ProjectHelper } from '../../core/project/ProjectHelper';

export interface ProjectState {
  /**
   * <p>Current opened project.</p>
   *
   * <p>As Openlayers objects are mutables, we do not
   */
  current?: AbcProject;
}

export const projectInitialState: ProjectState = {
  current: ProjectHelper.newProject(),
};
