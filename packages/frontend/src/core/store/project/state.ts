import { AbcLayout, AbcProjectMetadata } from '@abc-map/shared-entities';
import { ProjectFactory } from '../../project/ProjectFactory';

export interface ProjectState {
  /**
   * Metadata of current project.
   */
  metadata: AbcProjectMetadata;

  /**
   * Layouts of current project
   */
  layouts: AbcLayout[];
}

export const projectInitialState: ProjectState = {
  metadata: ProjectFactory.newProjectMetadata(),
  layouts: [],
};
