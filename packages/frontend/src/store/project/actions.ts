export enum ActionType {
  NEW_PROJECT = 'NEW_PROJECT',
}

export interface NewProject {
  type: ActionType.NEW_PROJECT;
}

export type ProjectAction = NewProject;

export class ProjectActions {
  public static newProject(): ProjectAction {
    return {
      type: ActionType.NEW_PROJECT,
    };
  }
}
