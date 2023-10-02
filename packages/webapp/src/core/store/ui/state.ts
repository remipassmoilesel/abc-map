/**
 * Copyright © 2023 Rémi Pace.
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
import { BundledModuleId } from '@abc-map/shared';

export interface UiState {
  historyCapabilities: {
    [k: string]:
      | {
          canUndo: boolean;
          canRedo: boolean;
        }
      | undefined;
  };
  /**
   * State of side menus (open / closed)
   */
  sideMenu: {
    [k: string]: boolean | undefined;
  };
  /**
   * Information screens, that have to be shown and acknowledged once
   */
  informations: {
    riskyDevice: boolean;
    installApp: boolean;
  };
  /**
   * Experimental features are features not enabled by default
   */
  experimentalFeatures: {
    [k: string]: boolean | undefined;
  };
  /**
   * Number of visits
   *
   * We do not store more than one visit for privacy purposes.
   */
  visits: number;
  /**
   * This list is used in inputs. URLs here may not have been loaded
   */
  remoteModuleUrls: string[];
  /**
   * We keep the list of the last modules used.
   *
   */
  lastModulesUsed: string[];
  /**
   * List of user preferred module IDs
   */
  favoriteModules: string[];
  serviceWorker: ServiceWorkerUiState;
}

export type InformationKey = keyof UiState['informations'];

export const DefaultFavoriteModules = [BundledModuleId.DataStore, BundledModuleId.MapExport, BundledModuleId.SharedMapSettings];

export interface ServiceWorkerUiState {
  present: boolean;
  installed: boolean;
  updateAvailable: boolean;
  error: boolean;
}

export const uiInitialState: UiState = {
  historyCapabilities: {},
  sideMenu: {},
  informations: {
    riskyDevice: false,
    installApp: false,
  },
  experimentalFeatures: {},
  visits: 0,
  remoteModuleUrls: [],
  lastModulesUsed: [],
  favoriteModules: DefaultFavoriteModules,
  serviceWorker: {
    present: false,
    installed: false,
    error: false,
    updateAvailable: false,
  },
};
