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
import { AbcTextFrame } from '@abc-map/shared';

/**
 * Warning: this function MUST be fast, and we MUST clone state to return a new state object
 *
 * Also, project objet can be very heavy so please avoid deep clone
 */
export function projectReducer(state = projectInitialState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case ActionType.LoadProject: {
      return {
        metadata: action.project.metadata,
        mainView: action.project.view,
        layouts: {
          list: action.project.layouts,
        },
        sharedViews: {
          list: action.project.sharedViews.list,
          fullscreen: action.project.sharedViews.fullscreen,
          mapDimensions: action.project.sharedViews.mapDimensions,
        },
      };
    }

    case ActionType.SetProjectName: {
      const newState: ProjectState = { ...state };
      newState.metadata = { ...state.metadata };
      newState.metadata.name = action.name;
      return newState;
    }

    case ActionType.AddLayout: {
      const newState: ProjectState = { ...state, layouts: { ...state.layouts } };
      newState.layouts.list = state.layouts.list.slice();
      newState.layouts.list.splice(action.index ?? newState.layouts.list.length, 0, action.layout);
      return newState;
    }

    case ActionType.AddLayouts: {
      const newState: ProjectState = { ...state, layouts: { ...state.layouts } };
      newState.layouts.list = [...state.layouts.list, ...action.layouts];
      return newState;
    }

    case ActionType.UpdateLayout: {
      const newState: ProjectState = { ...state, layouts: { ...state.layouts } };
      newState.layouts.list = state.layouts.list.map((previous) => {
        return previous.id === action.layout.id ? action.layout : previous;
      });
      return newState;
    }

    case ActionType.SetLayoutIndex: {
      const list = state.layouts.list.filter((lay) => lay.id !== action.layout.id);
      list.splice(action.index, 0, action.layout);

      const newState: ProjectState = { ...state, layouts: { ...state.layouts } };
      newState.layouts.list = list;
      return newState;
    }

    case ActionType.RemoveLayouts: {
      const newState: ProjectState = { ...state, layouts: { ...state.layouts } };
      newState.layouts.list = state.layouts.list.filter((lay) => !action.ids.find((i) => lay.id === i));
      return newState;
    }

    case ActionType.ClearLayouts: {
      return { ...state, layouts: { list: [], activeId: undefined } };
    }

    case ActionType.SetActiveLayout: {
      const newState: ProjectState = { ...state, layouts: { ...state.layouts } };
      newState.layouts.activeId = action.id;
      return newState;
    }

    case ActionType.UpdateTextFrame:
      return transformTextFrame(state, action.frame.id, () => action.frame);

    case ActionType.AddSharedView: {
      const newState: ProjectState = { ...state, sharedViews: { ...state.sharedViews } };
      newState.sharedViews.list = newState.sharedViews.list.slice();
      newState.sharedViews.list.splice(action.index ?? newState.sharedViews.list.length, 0, action.view);
      return newState;
    }

    case ActionType.AddSharedViews: {
      const newState: ProjectState = { ...state, sharedViews: { ...state.sharedViews } };
      newState.sharedViews.list = newState.sharedViews.list.slice();
      newState.sharedViews.list = newState.sharedViews.list.concat(action.views);
      return newState;
    }

    case ActionType.UpdateSharedView: {
      const newState: ProjectState = { ...state, sharedViews: { ...state.sharedViews } };
      newState.sharedViews.list = newState.sharedViews.list.map((previous) => {
        return previous.id === action.view.id ? action.view : previous;
      });
      return newState;
    }

    case ActionType.RemoveSharedViews: {
      const newState: ProjectState = { ...state, sharedViews: { ...state.sharedViews } };
      newState.sharedViews.list = newState.sharedViews.list.filter((viewA) => !action.views.find((viewB) => viewB.id === viewA.id));
      return newState;
    }

    case ActionType.SetSharedMapDimensions: {
      const newState: ProjectState = { ...state, sharedViews: { ...state.sharedViews } };
      newState.sharedViews.mapDimensions = { width: action.width, height: action.height };
      return newState;
    }

    case ActionType.SetSharedMapFullscreen: {
      const newState: ProjectState = { ...state, sharedViews: { ...state.sharedViews } };
      newState.sharedViews.fullscreen = action.value;
      return newState;
    }

    case ActionType.SetActiveSharedView: {
      return { ...state, sharedViews: { ...state.sharedViews, activeId: action.id } };
    }

    case ActionType.SetView: {
      const newState: ProjectState = { ...state };
      newState.mainView = {
        ...action.view,
        center: action.view.center.slice(),
        projection: { ...action.view.projection },
      };
      return newState;
    }

    case ActionType.SetPublic: {
      const newState: ProjectState = { ...state, metadata: { ...state.metadata } };
      newState.metadata.public = action.value;
      return newState;
    }

    default:
      return state;
  }
}

function transformTextFrame(state: ProjectState, frameId: string, cb: (frame: AbcTextFrame) => AbcTextFrame): ProjectState {
  const newState: ProjectState = { ...state, layouts: { ...state.layouts }, sharedViews: { ...state.sharedViews } };

  newState.layouts.list = newState.layouts.list.map((layout) => {
    const textFrames: AbcTextFrame[] = layout.textFrames.map((frame) => {
      if (frame.id === frameId) {
        return cb(frame);
      } else {
        return frame;
      }
    });

    return { ...layout, textFrames };
  });

  newState.sharedViews.list = newState.sharedViews.list.map((view) => {
    const textFrames: AbcTextFrame[] = view.textFrames.map((frame) => {
      if (frame.id === frameId) {
        return cb(frame);
      } else {
        return frame;
      }
    });

    return { ...view, textFrames };
  });

  return newState;
}
