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

import { AbcLayout, AbcLegend, AbcLegendItem, AbcProjectManifest, AbcSharedView, AbcView, LegendDisplay } from '@abc-map/shared';

export enum ActionType {
  LoadProject = 'LoadProject',
  SetProjectName = 'SetProjectName',
  AddLayouts = 'AddLayouts',
  UpdateLayout = 'UpdateLayout',
  SetLayoutIndex = 'SetLayoutIndex',
  ClearLayouts = 'ClearLayouts',
  RemoveLayouts = 'RemoveLayouts',
  SetActiveLayout = 'SetActiveLayout',
  AddLegendItems = 'AddLegendItems',
  UpdateLegend = 'UpdateLegend',
  UpdateLegendItem = 'UpdateLegendItem',
  SetLegendSize = 'SetLegendSize',
  SetLegendDisplay = 'SetLegendDisplay',
  SetLegendItemIndex = 'SetLegendItemIndex',
  DeleteLegendItem = 'DeleteLegendItem',
  AddSharedViews = 'AddSharedViews',
  SetActiveSharedView = 'SetActiveSharedView',
  UpdateSharedView = 'UpdateSharedView',
  RemoveSharedViews = 'RemoveSharedViews',
  SetView = 'SetView',
  SetPublic = 'SetPublic',
}

export interface LoadProject {
  type: ActionType.LoadProject;
  project: AbcProjectManifest;
}

export interface SetProjectName {
  type: ActionType.SetProjectName;
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

export interface SetActiveLayout {
  type: ActionType.SetActiveLayout;
  id: string | undefined;
}

export interface AddLegendItems {
  type: ActionType.AddLegendItems;
  items: AbcLegendItem[];
  legendId: string;
}

export interface UpdateLegendItem {
  type: ActionType.UpdateLegendItem;
  item: AbcLegendItem;
  legendId: string;
}

export interface UpdateLegend {
  type: ActionType.UpdateLegend;
  legend: AbcLegend;
}

export interface SetLegendSize {
  type: ActionType.SetLegendSize;
  width: number;
  height: number;
  legendId: string;
}

export interface SetLegendDisplay {
  type: ActionType.SetLegendDisplay;
  display: LegendDisplay;
  legendId: string;
}

export interface DeleteLegendItem {
  type: ActionType.DeleteLegendItem;
  item: AbcLegendItem;
  legendId: string;
}

export interface SetLegendItemIndex {
  type: ActionType.SetLegendItemIndex;
  item: AbcLegendItem;
  index: number;
  legendId: string;
}

export interface AddSharedViews {
  type: ActionType.AddSharedViews;
  views: AbcSharedView[];
}

export interface SetActiveSharedView {
  type: ActionType.SetActiveSharedView;
  id: string;
}

export interface UpdateSharedView {
  type: ActionType.UpdateSharedView;
  view: AbcSharedView;
}

export interface RemoveSharedViews {
  type: ActionType.RemoveSharedViews;
  views: AbcSharedView[];
}

export interface SetView {
  type: ActionType.SetView;
  view: AbcView;
}

export interface SetPublic {
  type: ActionType.SetPublic;
  value: boolean;
}

export type ProjectAction =
  | LoadProject
  | SetProjectName
  | AddLayouts
  | RemoveLayouts
  | UpdateLayout
  | SetLayoutIndex
  | ClearLayouts
  | SetActiveLayout
  | AddLegendItems
  | UpdateLegend
  | UpdateLegendItem
  | SetLegendSize
  | SetLegendDisplay
  | DeleteLegendItem
  | SetLegendItemIndex
  | AddSharedViews
  | SetActiveSharedView
  | UpdateSharedView
  | RemoveSharedViews
  | SetView
  | SetPublic;

export class ProjectActions {
  public static loadProject(project: AbcProjectManifest): ProjectAction {
    return {
      type: ActionType.LoadProject,
      project,
    };
  }

  public static setProjectName(name: string): ProjectAction {
    return {
      type: ActionType.SetProjectName,
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

  public static setActiveLayout(id: string | undefined): ProjectAction {
    return {
      type: ActionType.SetActiveLayout,
      id,
    };
  }

  public static addLegendItems(legendId: string, items: AbcLegendItem[]): ProjectAction {
    return {
      type: ActionType.AddLegendItems,
      items,
      legendId,
    };
  }

  public static updateLegend(legend: AbcLegend): ProjectAction {
    return {
      type: ActionType.UpdateLegend,
      legend,
    };
  }

  public static updateLegendItem(legendId: string, item: AbcLegendItem): ProjectAction {
    return {
      type: ActionType.UpdateLegendItem,
      item,
      legendId,
    };
  }

  public static setLegendSize(legendId: string, width: number, height: number): ProjectAction {
    return {
      type: ActionType.SetLegendSize,
      width,
      height,
      legendId,
    };
  }

  public static setLegendDisplay(legendId: string, display: LegendDisplay): ProjectAction {
    return {
      type: ActionType.SetLegendDisplay,
      display,
      legendId,
    };
  }

  public static deleteLegendItem(legendId: string, item: AbcLegendItem): ProjectAction {
    return {
      type: ActionType.DeleteLegendItem,
      item,
      legendId,
    };
  }

  public static setLegendItemIndex(legendId: string, item: AbcLegendItem, index: number): ProjectAction {
    return {
      type: ActionType.SetLegendItemIndex,
      item,
      index,
      legendId,
    };
  }

  public static addSharedViews(views: AbcSharedView[]): ProjectAction {
    return {
      type: ActionType.AddSharedViews,
      views,
    };
  }

  public static setActiveSharedView(id: string): ProjectAction {
    return {
      type: ActionType.SetActiveSharedView,
      id,
    };
  }

  public static updateSharedView(view: AbcSharedView): ProjectAction {
    return {
      type: ActionType.UpdateSharedView,
      view,
    };
  }

  public static removeSharedViews(views: AbcSharedView[]): ProjectAction {
    return {
      type: ActionType.RemoveSharedViews,
      views,
    };
  }

  public static setView(view: AbcView): ProjectAction {
    return {
      type: ActionType.SetView,
      view,
    };
  }

  public static setPublic(value: boolean): ProjectAction {
    return {
      type: ActionType.SetPublic,
      value,
    };
  }
}
