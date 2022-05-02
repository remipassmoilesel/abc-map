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
import { RemoteModuleRef } from '../../../data-processing/_common/registry/RemoteModuleRef';

export interface UiState {
  historyCapabilities: {
    [k: string]:
      | {
          canUndo: boolean;
          canRedo: boolean;
        }
      | undefined;
  };
  documentation: {
    scrollPosition: number;
  };
  sideMenu: {
    [k: string]: boolean | undefined;
  };
  informations: {
    sharedMapAlpha: boolean;
  };
  experimentalFeatures: {
    [k: string]: boolean | undefined;
  };
  /**
   * These ids are used to update UI when list of modules change
   * It contains local and remote modules
   */
  modulesLoaded: string[];
  /**
   * This list contains only the loaded modules
   */
  remoteModules: RemoteModuleRef[];
  /**
   * This list is used in inputs. URLs here may not have been loaded
   */
  remoteModuleUrls: string[];
}

export const uiInitialState: UiState = {
  historyCapabilities: {},
  documentation: { scrollPosition: 0 },
  sideMenu: {},
  informations: {
    sharedMapAlpha: false,
  },
  experimentalFeatures: {},
  modulesLoaded: [],
  remoteModules: [],
  remoteModuleUrls: [],
};
