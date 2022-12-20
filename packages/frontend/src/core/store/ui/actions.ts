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

import { HistoryKey } from '../../history/HistoryKey';
import { InformationKey } from './state';

export enum ActionType {
  SetHistoryCapabilities = 'SetHistoryCapabilities',
  CleanHistoryCapabilities = 'CleanHistoryCapabilities',
  SetDocumentationScrollPosition = 'SetDocumentationScrollPosition',
  SetSideMenuState = 'SetSideMenuState',
  AckInformation = 'AckInformation',
  SetExperimentalFeature = 'SetExperimentalFeature',
  IncrementVisitCounter = 'IncrementVisitCounter',
  SetRemoteModuleUrls = 'SetRemoteModuleUrls',
  RegisterModuleUsage = 'RegisterModuleUsage',
  MarkFavorite = 'MarkFavorite',
  RestoreDefaultFavoriteModules = 'RestoreDefaultFavoriteModules',
}

export interface SetHistoryCapabilities {
  type: ActionType.SetHistoryCapabilities;
  key: HistoryKey;
  canUndo: boolean;
  canRedo: boolean;
}

export interface CleanHistoryCapabilities {
  type: ActionType.CleanHistoryCapabilities;
}

export interface SetDocumentationScrollPosition {
  type: ActionType.SetDocumentationScrollPosition;
  position: number;
}

export interface SetSideMenuState {
  type: ActionType.SetSideMenuState;
  menuId: string;
  state: boolean;
}

export interface AckInformation {
  type: ActionType.AckInformation;
  name: InformationKey;
}

export interface SetExperimentalFeature {
  type: ActionType.SetExperimentalFeature;
  id: string;
  state: boolean;
}

export interface IncrementVisitCounter {
  type: ActionType.IncrementVisitCounter;
}

export interface SetRemoteModuleUrls {
  type: ActionType.SetRemoteModuleUrls;
  moduleUrls: string[];
}

export interface RegisterModuleUsage {
  type: ActionType.RegisterModuleUsage;
  moduleId: string;
}

export interface MarkFavorite {
  type: ActionType.MarkFavorite;
  moduleId: string;
  favorite: boolean;
}

export interface RestoreDefaultFavoriteModules {
  type: ActionType.RestoreDefaultFavoriteModules;
}

export type UiAction =
  | SetHistoryCapabilities
  | CleanHistoryCapabilities
  | SetDocumentationScrollPosition
  | SetSideMenuState
  | AckInformation
  | IncrementVisitCounter
  | SetExperimentalFeature
  | SetRemoteModuleUrls
  | RegisterModuleUsage
  | MarkFavorite
  | RestoreDefaultFavoriteModules;

export class UiActions {
  public static setHistoryCapabilities(key: HistoryKey, canUndo: boolean, canRedo: boolean): UiAction {
    return {
      type: ActionType.SetHistoryCapabilities,
      key,
      canUndo,
      canRedo,
    };
  }

  public static cleanHistoryCapabilities(): UiAction {
    return {
      type: ActionType.CleanHistoryCapabilities,
    };
  }

  public static setDocumentationScrollPosition(position: number): UiAction {
    return {
      type: ActionType.SetDocumentationScrollPosition,
      position,
    };
  }

  public static setSideMenuState(menuId: string, state: boolean): UiAction {
    return {
      type: ActionType.SetSideMenuState,
      menuId,
      state,
    };
  }

  public static ackInformation(name: InformationKey): UiAction {
    return {
      type: ActionType.AckInformation,
      name,
    };
  }

  public static setExperimentalFeature(id: string, state: boolean): UiAction {
    return {
      type: ActionType.SetExperimentalFeature,
      id,
      state,
    };
  }

  public static incrementVisitCounter(): UiAction {
    return {
      type: ActionType.IncrementVisitCounter,
    };
  }

  public static setRemoteModuleUrls(moduleUrls: string[]): UiAction {
    return {
      type: ActionType.SetRemoteModuleUrls,
      moduleUrls,
    };
  }

  public static registerModuleUsage(moduleId: string): UiAction {
    return {
      type: ActionType.RegisterModuleUsage,
      moduleId,
    };
  }

  public static markFavorite(moduleId: string, favorite: boolean): UiAction {
    return {
      type: ActionType.MarkFavorite,
      moduleId,
      favorite,
    };
  }

  public static restoreDefaultFavoriteModules(): UiAction {
    return {
      type: ActionType.RestoreDefaultFavoriteModules,
    };
  }
}
