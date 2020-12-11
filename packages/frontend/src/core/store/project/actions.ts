import { AbcProject } from '@abc-map/shared-entities';

export enum ActionType {
  NewProject = 'NewProject',
}

export interface NewProject {
  type: ActionType.NewProject;
  project: AbcProject;
}

export type ProjectAction = NewProject;

export class ProjectActions {
  public static newProject(project: AbcProject): ProjectAction {
    return {
      type: ActionType.NewProject,
      project,
    };
  }
}
