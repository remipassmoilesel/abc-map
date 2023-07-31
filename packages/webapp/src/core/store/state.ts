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

import { projectInitialState } from './project/state';
import { mapInitialState } from './map/state';
import { authenticationInitialState } from './authentication/state';
import { uiInitialState } from './ui/state';
import { MainState } from './reducer';

export function initialState(): MainState {
  return {
    project: projectInitialState,
    map: mapInitialState,
    authentication: authenticationInitialState,
    ui: uiInitialState,
  };
}

export const CURRENT_STATE_VERSION = 1;

export function toPersistedState(state: MainState): MainState {
  return {
    ...state,
    project: {
      ...state.project,
      layouts: {
        ...state.project.layouts,
        activeId: undefined,
      },
      sharedViews: {
        ...state.project.sharedViews,
        activeId: undefined,
        mapDimensions: {
          ...state.project.sharedViews.mapDimensions,
          width: 0,
          height: 0,
        },
      },
      lastSaveOnline: null,
      lastExport: null,
    },
    map: {
      ...state.map,
    },
    ui: {
      ...state.ui,
      historyCapabilities: {},
      sideMenu: {},
      serviceWorker: {
        present: false,
        error: false,
        updateAvailable: false,
        installed: false,
      },
    },
  };
}
