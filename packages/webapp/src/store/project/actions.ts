/**
 * Copyright © 2026 Rémi Pace.
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

import type { AbcLayout, AbcProjectManifest, AbcSharedView, AbcTextFrame, AbcView } from '@abc-map/shared';

export enum ActionType {
  LoadProject = 'Project-LoadProject',
  SetProjectName = 'Project-SetProjectName',
  AddLayout = 'Project-AddLayout',
  AddLayouts = 'Project-AddLayouts',
  UpdateLayout = 'Project-UpdateLayout',
  SetLayoutIndex = 'Project-SetLayoutIndex',
  ClearLayouts = 'Project-ClearLayouts',
  RemoveLayouts = 'Project-RemoveLayouts',
  SetActiveLayout = 'Project-SetActiveLayout',
  UpdateTextFrame = 'Project-UpdateTextFrame',
  AddSharedView = 'Project-AddSharedView',
  AddSharedViews = 'Project-AddSharedViews',
  SetActiveSharedView = 'Project-SetActiveSharedView',
  UpdateSharedView = 'Project-UpdateSharedView',
  RemoveSharedViews = 'Project-RemoveSharedViews',
  SetSharedMapDimensions = 'Project-SetSharedMapDimensions',
  SetSharedMapFullscreen = 'Project-SetSharedMapFullscreen',
  SetView = 'Project-SetView',
  SetPublic = 'Project-SetPublic',
  SetLastSaveOnline = 'Project-SetLastSaveOnline',
  SetLastExport = 'Project-SetLastExport',
  SetAbcMapAttributions = 'Project-SetAbcMapAttributions',
}

export interface LoadProject {
  type: ActionType.LoadProject;
  project: AbcProjectManifest;
}

export interface SetProjectName {
  type: ActionType.SetProjectName;
  name: string;
}

export interface AddLayout {
  type: ActionType.AddLayout;
  layout: AbcLayout;
  index?: number;
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

export interface UpdateTextFrame {
  type: ActionType.UpdateTextFrame;
  frame: AbcTextFrame;
}

export interface AddSharedView {
  type: ActionType.AddSharedView;
  view: AbcSharedView;
  index?: number;
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

export interface SetSharedMapDimensions {
  type: ActionType.SetSharedMapDimensions;
  width: number;
  height: number;
}

export interface SetSharedMapFullscreen {
  type: ActionType.SetSharedMapFullscreen;
  value: boolean;
}

export interface SetView {
  type: ActionType.SetView;
  view: AbcView;
}

export interface SetPublic {
  type: ActionType.SetPublic;
  value: boolean;
}

export interface SetLastSaveOnline {
  type: ActionType.SetLastSaveOnline;
  timestampMs: number;
}

export interface SetLastExport {
  type: ActionType.SetLastExport;
  timestampMs: number;
}

export interface SetAbcMapAttributions {
  type: ActionType.SetAbcMapAttributions;
  value: boolean;
}

export type ProjectAction =
  | LoadProject
  | SetProjectName
  | AddLayout
  | AddLayouts
  | RemoveLayouts
  | UpdateLayout
  | SetLayoutIndex
  | ClearLayouts
  | SetActiveLayout
  | UpdateTextFrame
  | AddSharedView
  | AddSharedViews
  | SetActiveSharedView
  | UpdateSharedView
  | RemoveSharedViews
  | SetSharedMapDimensions
  | SetSharedMapFullscreen
  | SetView
  | SetPublic
  | SetLastSaveOnline
  | SetLastExport
  | SetAbcMapAttributions;

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

  public static addLayout(layout: AbcLayout, index?: number): ProjectAction {
    return {
      type: ActionType.AddLayout,
      layout,
      index,
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

  public static updateTextFrame(frame: AbcTextFrame): ProjectAction {
    return {
      type: ActionType.UpdateTextFrame,
      frame,
    };
  }

  public static addSharedViews(views: AbcSharedView[]): ProjectAction {
    return {
      type: ActionType.AddSharedViews,
      views,
    };
  }

  public static addSharedView(view: AbcSharedView, index?: number): ProjectAction {
    return {
      type: ActionType.AddSharedView,
      view,
      index,
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

  public static setSharedMapDimensions(width: number, height: number): ProjectAction {
    return {
      type: ActionType.SetSharedMapDimensions,
      width,
      height,
    };
  }

  public static setSharedMapFullscreen(value: boolean): ProjectAction {
    return {
      type: ActionType.SetSharedMapFullscreen,
      value,
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

  public static setLastSaveOnline(timestampMs: number): ProjectAction {
    return {
      type: ActionType.SetLastSaveOnline,
      timestampMs,
    };
  }

  public static setLastExport(timestampMs: number): ProjectAction {
    return {
      type: ActionType.SetLastExport,
      timestampMs,
    };
  }

  public static setAbcMapAttributions(value: boolean): ProjectAction {
    return {
      type: ActionType.SetAbcMapAttributions,
      value,
    };
  }
}
