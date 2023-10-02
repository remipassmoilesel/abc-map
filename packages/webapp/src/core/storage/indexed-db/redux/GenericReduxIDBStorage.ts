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

import { Logger } from '@abc-map/shared';
import { MainStore } from '../../../store/store';
import { Unsubscribe } from 'redux';
import isEqual from 'lodash/isEqual';
import { IndexedDbClient, toKvPair } from '../client/IndexedDbClient';
import { MainState } from '../../../store/reducer';
import { getMainDbClient } from '../main-database';
import { throttleDbStorage } from '../client/throttleDbStorage';
import { GenericReduxIDBEntry } from './GenericReduxIDBEntry';

export const logger = Logger.get('GenericReduxStorage.ts');

export function disableGenericStorageLog() {
  logger.disable();
}

export type ReduxStoreSelector<T> = (s: MainState) => T[];

export type ValidEntity = { id: IDBValidKey };

/**
 * You can use this storage to save parts of a project, e.g layouts or shared views.
 */
export class GenericReduxIDBStorage<T extends ValidEntity> {
  public static create<T extends ValidEntity>(storeName: string, reduxSelector: ReduxStoreSelector<T>, version: number): GenericReduxIDBStorage<T> {
    return new GenericReduxIDBStorage(getMainDbClient, storeName, reduxSelector, version);
  }

  private unsubscribe: Unsubscribe | undefined;

  constructor(
    private getClient: () => IndexedDbClient | undefined,
    private storeName: string,
    private selector: ReduxStoreSelector<T>,
    private version: number
  ) {}

  public watch(store: MainStore, throttlingMs = 5_000) {
    let previouslySaved: T[] = [];

    const handleStoreChange = () => {
      const candidates = this.selector(store.getState());
      const toSave = candidates.filter((objA) => !previouslySaved.find((objB) => isEqual(objA, objB)));

      if (!toSave.length) {
        return;
      }

      const start = Date.now();
      this.putAll(toSave)
        .then(() => (previouslySaved = candidates))
        .catch((err) => logger.error('Save error: ', err))
        .finally(() => logger.debug(`Saved objects in ${Date.now() - start}ms`, toSave));
    };

    this.unsubscribe = store.subscribe(throttleDbStorage(handleStoreChange, throttlingMs));

    // We save manually the first time
    handleStoreChange();
  }

  public unwatch() {
    this.unsubscribe && this.unsubscribe();
  }

  public async putAll(values: T[]): Promise<void> {
    const client = this.getClient();
    if (!client) {
      logger.warn('Not connected, cannot save entries.');
      return;
    }

    const genericEntries = values.map((entry) => ({ version: this.version, id: entry.id, entry }));
    await client.putAll<GenericReduxIDBEntry<T>>(this.storeName, toKvPair(genericEntries));
  }

  public async getAll(ids: string[]): Promise<T[]> {
    const client = this.getClient();
    if (!client) {
      logger.warn('Not connected, cannot get entries.');
      return [];
    }

    return client.getAllByKeys<GenericReduxIDBEntry<T>>(this.storeName, ids).then((entries) => entries.map((entry) => entry.entry));
  }
}
