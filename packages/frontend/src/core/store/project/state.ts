import { AbcProject } from '@abc-map/shared-entities';
import { ProjectFactory } from '../../project/ProjectFactory';

export interface ProjectState {
  /**
   * <p>Current opened project.</p>
   *
   * <p>This objects is not necessarily up to date, and it will never contains layers and data.
   * Layers and data are managed in main map state.</p>
   */
  // FIXME: TODO: change type to project metadata here
  current?: AbcProject;
}

export const projectInitialState: ProjectState = {
  current: ProjectFactory.newProject(),
};
