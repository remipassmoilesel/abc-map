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

import { ActionType, UiAction } from './actions';
import { uiInitialState, UiState } from './state';

/**
 * Warning: this function MUST be fast, and we MUST clone state to return a new state object
 *
 */
export function uiReducer(state = uiInitialState, action: UiAction): UiState {
  switch (action.type) {
    case ActionType.SetHistoryCapabilities: {
      const newState: UiState = { ...state };
      newState.historyCapabilities = { ...state.historyCapabilities };
      newState.historyCapabilities[action.key] = {
        canUndo: action.canUndo,
        canRedo: action.canRedo,
      };
      return newState;
    }

    case ActionType.CleanHistoryCapabilities: {
      const newState: UiState = { ...state };
      newState.historyCapabilities = {};
      return newState;
    }

    case ActionType.SetDocumentationScrollPosition: {
      const newState: UiState = { ...state };
      newState.documentation = { ...newState.documentation };
      newState.documentation.scrollPosition = action.position;
      return newState;
    }

    case ActionType.SetSideMenuState: {
      return {
        ...state,
        sideMenu: {
          ...state.sideMenu,
          [action.menuId]: action.state,
        },
      };
    }

    case ActionType.AckInformation: {
      return {
        ...state,
        informations: {
          ...state.informations,
          [action.name]: true,
        },
      };
    }

    case ActionType.SetExperimentalFeature: {
      return {
        ...state,
        experimentalFeatures: {
          ...state.experimentalFeatures,
          [action.id]: action.state,
        },
      };
    }

    case ActionType.SetLoadedModules: {
      return {
        ...state,
        modulesLoaded: action.moduleIds,
      };
    }

    case ActionType.SetRemoteModules: {
      return {
        ...state,
        remoteModules: action.modules,
      };
    }

    case ActionType.SetRemoteModuleUrls: {
      return {
        ...state,
        remoteModuleUrls: action.moduleUrls,
      };
    }

    case ActionType.IncrementVisitCounter: {
      // We do not store all visits for privacy purposes
      let visits = state.visits + 1;
      if (visits > 2) {
        visits = 2;
      }

      return { ...state, visits };
    }

    default:
      return state;
  }
}
