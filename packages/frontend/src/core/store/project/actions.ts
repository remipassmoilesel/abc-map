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

import { AbcLayout, AbcLegendItem, AbcProjectManifest, AbcView, LegendDisplay } from '@abc-map/shared';

export enum ActionType {
  LoadProject = 'LoadProject',
  RenameProject = 'RenameProject',
  AddLayouts = 'AddLayouts',
  UpdateLayout = 'UpdateLayout',
  SetLayoutIndex = 'SetLayoutIndex',
  ClearLayouts = 'ClearLayouts',
  RemoveLayouts = 'RemoveLayouts',
  AddLegendItems = 'AddLegendItems',
  UpdateLegendItem = 'UpdateLegendItem',
  SetLegendSize = 'SetLegendSize',
  SetLegendDisplay = 'SetLegendDisplay',
  SetLegendItemIndex = 'SetLegendItemIndex',
  DeleteLegendItem = 'DeleteLegendItem',
  ViewChanged = 'ViewChanged',
}

export interface LoadProject {
  type: ActionType.LoadProject;
  project: AbcProjectManifest;
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

export interface AddLegendItems {
  type: ActionType.AddLegendItems;
  items: AbcLegendItem[];
}

export interface UpdateLegendItem {
  type: ActionType.UpdateLegendItem;
  item: AbcLegendItem;
}

export interface SetLegendSize {
  type: ActionType.SetLegendSize;
  width: number;
  height: number;
}

export interface SetLegendDisplay {
  type: ActionType.SetLegendDisplay;
  display: LegendDisplay;
}

export interface DeleteLegendItem {
  type: ActionType.DeleteLegendItem;
  item: AbcLegendItem;
}

export interface SetLegendItemIndex {
  type: ActionType.SetLegendItemIndex;
  item: AbcLegendItem;
  index: number;
}

export interface ViewChanged {
  type: ActionType.ViewChanged;
  view: AbcView;
}

export type ProjectAction =
  | LoadProject
  | RenameProject
  | AddLayouts
  | RemoveLayouts
  | UpdateLayout
  | SetLayoutIndex
  | ClearLayouts
  | AddLegendItems
  | UpdateLegendItem
  | SetLegendSize
  | SetLegendDisplay
  | DeleteLegendItem
  | SetLegendItemIndex
  | ViewChanged;

export class ProjectActions {
  public static loadProject(project: AbcProjectManifest): ProjectAction {
    return {
      type: ActionType.LoadProject,
      project,
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

  public static addItems(items: AbcLegendItem[]): ProjectAction {
    return {
      type: ActionType.AddLegendItems,
      items,
    };
  }

  public static updateItem(item: AbcLegendItem): ProjectAction {
    return {
      type: ActionType.UpdateLegendItem,
      item,
    };
  }

  public static setLegendSize(width: number, height: number): ProjectAction {
    return {
      type: ActionType.SetLegendSize,
      width,
      height,
    };
  }

  public static setLegendDisplay(display: LegendDisplay): ProjectAction {
    return {
      type: ActionType.SetLegendDisplay,
      display,
    };
  }

  public static deleteLegendItem(item: AbcLegendItem): ProjectAction {
    return {
      type: ActionType.DeleteLegendItem,
      item,
    };
  }

  public static setLegendItemIndex(item: AbcLegendItem, index: number): ProjectAction {
    return {
      type: ActionType.SetLegendItemIndex,
      item,
      index,
    };
  }

  public static viewChanged(view: AbcView): ProjectAction {
    return {
      type: ActionType.ViewChanged,
      view,
    };
  }
}
