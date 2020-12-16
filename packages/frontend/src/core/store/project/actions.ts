import { AbcLayout, AbcProject } from '@abc-map/shared-entities';

export enum ActionType {
  NewProject = 'NewProject',
  NewLayout = 'NewLayout',
  UpdateLayout = 'UpdateLayout',
  ClearLayouts = 'ClearLayouts',
}

export interface NewProject {
  type: ActionType.NewProject;
  project: AbcProject;
}

export interface NewLayout {
  type: ActionType.NewLayout;
  layout: AbcLayout;
}

export interface UpdateLayout {
  type: ActionType.UpdateLayout;
  layout: AbcLayout;
}

export interface ClearLayouts {
  type: ActionType.ClearLayouts;
}

export type ProjectAction = NewProject | NewLayout | UpdateLayout | ClearLayouts;

export class ProjectActions {
  public static newProject(project: AbcProject): ProjectAction {
    return {
      type: ActionType.NewProject,
      project,
    };
  }

  public static newLayout(layout: AbcLayout): ProjectAction {
    return {
      type: ActionType.NewLayout,
      layout,
    };
  }

  public static updateLayout(layout: AbcLayout): ProjectAction {
    return {
      type: ActionType.UpdateLayout,
      layout,
    };
  }

  public static clearLayouts(): ProjectAction {
    return {
      type: ActionType.ClearLayouts,
    };
  }
}
