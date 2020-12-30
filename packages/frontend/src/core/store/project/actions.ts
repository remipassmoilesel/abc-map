import { AbcLayout, AbcProject, AbcProjectMetadata } from '@abc-map/shared-entities';

export enum ActionType {
  NewProject = 'NewProject',
  RenameProject = 'RenameProject',
  NewLayout = 'NewLayout',
  UpdateLayout = 'UpdateLayout',
  ClearLayouts = 'ClearLayouts',
  LoadProject = 'LoadProject',
}

export interface NewProject {
  type: ActionType.NewProject;
  metadata: AbcProjectMetadata;
}

export interface RenameProject {
  type: ActionType.RenameProject;
  name: string;
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

export interface LoadProject {
  type: ActionType.LoadProject;
  project: AbcProject;
}

export type ProjectAction = NewProject | RenameProject | NewLayout | UpdateLayout | ClearLayouts | LoadProject;

export class ProjectActions {
  public static newProject(metadata: AbcProjectMetadata): ProjectAction {
    return {
      type: ActionType.NewProject,
      metadata,
    };
  }

  public static renameProject(name: string): ProjectAction {
    return {
      type: ActionType.RenameProject,
      name,
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

  public static loadProject(project: AbcProject): ProjectAction {
    return {
      type: ActionType.LoadProject,
      project,
    };
  }
}
