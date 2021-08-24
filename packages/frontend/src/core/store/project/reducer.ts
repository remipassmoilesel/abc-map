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

import { ActionType, ProjectAction } from './actions';
import { projectInitialState, ProjectState } from './state';

// TODO: test immutability of state in all branches

/**
 * Warning: this function MUST be fast, and we MUST clone state to return a new state object
 *
 * Also, project objet can be very heavy so please avoid deep clone
 */
export function projectReducer(state = projectInitialState, action: ProjectAction): ProjectState {
  if (!Object.values(ActionType).includes(action.type)) {
    return state;
  }

  switch (action.type) {
    case ActionType.LoadProject: {
      const newState: ProjectState = { ...state };
      newState.metadata = action.project.metadata;
      newState.layouts = action.project.layouts;
      newState.legend = action.project.legend;
      return newState;
    }

    case ActionType.RenameProject: {
      const newState: ProjectState = { ...state };
      newState.metadata = { ...state.metadata };
      newState.metadata.name = action.name;
      return newState;
    }

    case ActionType.AddLayouts: {
      const newState: ProjectState = { ...state };
      newState.layouts = [...state.layouts, ...action.layouts];
      return newState;
    }

    case ActionType.UpdateLayout: {
      const layouts = state.layouts.map((lay) => {
        return lay.id === action.layout.id ? action.layout : lay;
      });

      const newState: ProjectState = { ...state };
      newState.layouts = layouts;
      return newState;
    }

    case ActionType.SetLayoutIndex: {
      const layouts = state.layouts.filter((lay) => lay.id !== action.layout.id);
      layouts.splice(action.index, 0, action.layout);

      const newState: ProjectState = { ...state };
      newState.layouts = layouts;
      return newState;
    }

    case ActionType.RemoveLayouts: {
      const newState: ProjectState = { ...state };
      newState.layouts = state.layouts.filter((lay) => !action.ids.find((i) => lay.id === i));
      return newState;
    }

    case ActionType.ClearLayouts: {
      const newState: ProjectState = { ...state };
      newState.layouts = [];
      return newState;
    }

    case ActionType.AddLegendItems: {
      const newState: ProjectState = { ...state, legend: { ...state.legend } };
      newState.legend.items = [...state.legend.items, ...action.items];
      return newState;
    }

    case ActionType.UpdateLegendItem: {
      const newState: ProjectState = { ...state, legend: { ...state.legend } };
      newState.legend.items = state.legend.items.map((item) => {
        return item.id === action.item.id ? action.item : item;
      });
      return newState;
    }

    case ActionType.SetLegendSize: {
      const newState: ProjectState = { ...state, legend: { ...state.legend } };
      newState.legend.width = action.width;
      newState.legend.height = action.height;
      return newState;
    }

    case ActionType.SetLegendDisplay: {
      const newState: ProjectState = { ...state, legend: { ...state.legend } };
      newState.legend.display = action.display;
      return newState;
    }

    case ActionType.DeleteLegendItem: {
      const newState: ProjectState = { ...state, legend: { ...state.legend } };
      newState.legend.items = state.legend.items.filter((it) => it.id !== action.item.id);
      return newState;
    }

    case ActionType.SetLegendItemIndex: {
      const items = state.legend.items.filter((it) => it.id !== action.item.id);
      items.splice(action.index, 0, action.item);

      const newState: ProjectState = { ...state, legend: { ...state.legend } };
      newState.legend.items = items;
      return newState;
    }

    case ActionType.ViewChanged: {
      const newState: ProjectState = { ...state };
      newState.view = {
        resolution: action.view.resolution,
        center: action.view.center.slice(),
        projection: { ...action.view.projection },
      };
      return newState;
    }

    default:
      return state;
  }
}
