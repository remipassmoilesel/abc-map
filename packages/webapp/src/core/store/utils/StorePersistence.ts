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

import { StorageService, StorageKey } from '../../storage/StorageService';
import { Logger } from '@abc-map/shared';
import { MainState } from '../reducer';
import { CURRENT_STATE_VERSION, toPersistedState } from '../state';

const logger = Logger.get('StorePersistence', 'warn');

export interface PersistedMainState {
  version?: number;
  state?: MainState;
}

/**
 * This class persist Redux store in local storage in order to keep settings.
 *
 * Some state fields are erased before save (in order to get a consistent state at app startup)
 *
 */
export class StorePersistence {
  public static newPersistence() {
    return new StorePersistence(new StorageService());
  }

  constructor(private storage: StorageService) {}

  public loadState(): MainState | undefined {
    try {
      const serializedState = this.storage.get(StorageKey.REDUX_STATE);
      if (!serializedState) {
        return undefined;
      }
      const persisted: PersistedMainState = JSON.parse(serializedState);
      logger.debug('Loaded state: ', persisted);

      // FIXME: we should probably use a migration system
      if (persisted.version === CURRENT_STATE_VERSION) {
        return persisted.state;
      } else {
        logger.debug('Incorrect version, previous persisted state will not be used', { version: persisted.version, CURRENT_STATE_VERSION });
      }
    } catch (err) {
      logger.error('State load error: ', err);
      return undefined;
    }
  }

  /**
   * Clone state then store it in local storage.
   *
   * WARNING: this method can cause performance issues, beware of the map reference
   * @param state
   */
  public saveState(state: MainState): void {
    try {
      const persisted: PersistedMainState = {
        version: CURRENT_STATE_VERSION,
        state: toPersistedState(state),
      };

      const serialized = JSON.stringify(persisted);
      this.storage.set(StorageKey.REDUX_STATE, serialized);
      logger.debug('Saved state: ', serialized);
    } catch (err) {
      logger.error('Save state error: ', err);
    }
  }
}
