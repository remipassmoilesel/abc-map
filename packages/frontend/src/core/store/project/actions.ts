/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { AbcLayout, AbcProject, AbcProjectMetadata } from '@abc-map/shared-entities';

export enum ActionType {
  NewProject = 'NewProject',
  RenameProject = 'RenameProject',
  AddLayouts = 'AddLayouts',
  UpdateLayout = 'UpdateLayout',
  SetLayoutIndex = 'SetLayoutIndex',
  ClearLayouts = 'ClearLayouts',
  LoadProject = 'LoadProject',
  RemoveLayouts = 'RemoveLayouts',
}

export interface NewProject {
  type: ActionType.NewProject;
  metadata: AbcProjectMetadata;
}

export interface RenameProject {
  type: ActionType.RenameProject;
  name: string;
}

export interface AddLayouts {
  type: ActionType.AddLayouts;
  layouts: AbcLayout[];
}

export interface UpdateLayout {
  type: ActionType.UpdateLayout;
  layout: AbcLayout;
}

export interface SetLayoutIndex {
  type: ActionType.SetLayoutIndex;
  layout: AbcLayout;
  index: number;
}

export interface RemoveLayouts {
  type: ActionType.RemoveLayouts;
  ids: string[];
}

export interface ClearLayouts {
  type: ActionType.ClearLayouts;
}

export interface LoadProject {
  type: ActionType.LoadProject;
  project: AbcProject;
}

export type ProjectAction = NewProject | RenameProject | AddLayouts | RemoveLayouts | UpdateLayout | SetLayoutIndex | ClearLayouts | LoadProject;

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

  public static addLayouts(layouts: AbcLayout[]): ProjectAction {
    return {
      type: ActionType.AddLayouts,
      layouts,
    };
  }

  public static setLayoutIndex(layout: AbcLayout, index: number): ProjectAction {
    return {
      type: ActionType.SetLayoutIndex,
      layout,
      index,
    };
  }

  public static updateLayout(layout: AbcLayout): ProjectAction {
    return {
      type: ActionType.UpdateLayout,
      layout,
    };
  }

  public static removeLayouts(ids: string[]): ProjectAction {
    return {
      type: ActionType.RemoveLayouts,
      ids,
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
