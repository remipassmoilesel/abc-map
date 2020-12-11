import { AbcProject } from '@abc-map/shared-entities';
import { ProjectFactory } from '../../project/ProjectFactory';

export interface ProjectState {
  /**
   * <p>Current opened project.</p>
   *
   * <p>This objects is not necessarily up to date</p>
   */
  current?: AbcProject;
}

export const projectInitialState: ProjectState = {
  current: ProjectFactory.newProject(),
};
