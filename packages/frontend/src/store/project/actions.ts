export enum ActionType {
  NewProject = 'NewProject',
}

export interface NewProject {
  type: ActionType.NewProject;
}

export type ProjectAction = NewProject;

export class ProjectActions {
  public static newProject(): ProjectAction {
    return {
      type: ActionType.NewProject,
    };
  }
}
