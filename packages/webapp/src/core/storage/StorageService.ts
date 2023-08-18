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
import { getMainDbClient } from './indexed-db/main-database';
import { wait } from '../utils/wait';

export enum StorageKey {
  REDUX_STATE = 'ABC_MAP_REDUX_STATE',
  DEV_SERVICE_WORKER = 'ABC_MAP_DEV_SERVICE_WORKER',
}

export class StorageService {
  public get(key: StorageKey): string | null {
    return localStorage.getItem(key);
  }

  public set(key: StorageKey, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Clear local storage and indexed db storage.
   *
   * You should probably create a new project before.
   */
  public async clear(): Promise<void> {
    // We wait a little for throttled saves
    await wait(500);

    localStorage.clear();
    await getMainDbClient().clearDatabase();
  }
}