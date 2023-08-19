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
import isEqual from 'lodash/isEqual';
import { ObjectStore } from './ObjectStore';

export const logger = Logger.get('IndexedDbClient.ts', 'warn');

export interface KvPair<T = unknown> {
  key: IDBValidKey;
  value: T;
}

export function toKvPair<T extends { id: IDBValidKey }>(objs: T[]): KvPair<T>[] {
  return objs.map((obj) => ({ key: obj.id, value: obj }));
}

export type UpgradeHandler = (db: IDBDatabase, req: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => void;
export type CursorHandler<T> = (value: T | null, cursor: IDBCursorWithValue | null) => void;
export type CursorErrorHandler = (err: unknown) => void;

interface IndexedDbEntry<T> {
  key: IDBValidKey;
  value: T | undefined;
}

// See: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
export class IndexedDbClient {
  private database?: IDBDatabase;

  public async connect(databaseName: string, version = 1, onUpgradeNeeded: UpgradeHandler): Promise<IDBDatabase> {
    if (this.database) {
      throw new Error('Already connected');
    }

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(databaseName, version);

      request.onupgradeneeded = (ev) => onUpgradeNeeded(request.result, request, ev);

      request.onerror = (event) => {
        logger.error(`Database error:`, (event.target as IDBRequest)?.error);
        reject(new Error('Unexpected error'));
      };

      request.onsuccess = () => {
        this.database = request.result;
        resolve(request.result);
      };
    });
  }

  public disconnect(): void {
    if (!this.database) {
      throw new Error('Not connected');
    }

    this.database.close();
  }

  private getDatabase(): IDBDatabase {
    if (!this.database) {
      throw new Error('Not connected');
    }
    return this.database;
  }

  public async exists(storeName: string, key: string): Promise<boolean> {
    const db = this.getDatabase();
    const store = db.transaction(storeName, 'readonly').objectStore(storeName);

    return this.requestPromise(store.getKey(key)).then((res) => !!res.result);
  }

  public async put<T>(storeName: string, key: string, value: T): Promise<void> {
    const db = this.getDatabase();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    store.put(value, key);

    return this.transactionPromise(transaction).then(() => undefined);
  }

  public async putAll<T>(storeName: string, pairs: KvPair<T>[]): Promise<IDBTransaction> {
    const db = this.getDatabase();
    const transaction = db.transaction(storeName, 'readwrite', { durability: 'relaxed' });
    const store = transaction.objectStore(storeName);

    pairs.forEach(({ key, value }) => store.put(value, key));
    transaction.commit();

    return this.transactionPromise(transaction);
  }

  public async deleteAll(storeName: string, keys: (IDBValidKey | IDBKeyRange)[]): Promise<IDBTransaction> {
    const db = this.getDatabase();
    const transaction = db.transaction(storeName, 'readwrite', { durability: 'relaxed' });
    const store = transaction.objectStore(storeName);

    keys.forEach((key) => store.delete(key));
    transaction.commit();

    return this.transactionPromise(transaction);
  }

  public async get<T>(storeName: string, key: string): Promise<T | undefined> {
    const db = this.getDatabase();
    const store = db.transaction(storeName, 'readonly').objectStore(storeName);

    return this.requestPromise(store.get(key)).then((res) => res.result);
  }

  public async getAllByKeys<T>(storeName: string, keys: IDBValidKey[]): Promise<T[]> {
    if (!keys) {
      throw new Error('"keys" must be defined');
    }
    if (!keys.length) {
      return [];
    }

    const result: IndexedDbEntry<T>[] = [];

    return new Promise((resolve, reject) => {
      this.openCursor<T>(
        storeName,
        (value, cursor) => {
          const hasMore = value != null && typeof value !== 'undefined' && typeof cursor?.key !== 'undefined';
          if (hasMore) {
            const match = keys.find((key) => isEqual(key, cursor.key));
            if (match) {
              result.push({ key: cursor.key, value });
            }

            cursor.continue();
          } else {
            // We try to reproduce order from input
            const sorted = keys
              .map((inputKey) => result.find(({ key }) => key === inputKey))
              .map((entry) => entry?.value)
              .filter((value): value is T => !!value);

            resolve(sorted);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  public async getAll<T>(storeName: string): Promise<{ key: IDBValidKey; value: T }[]> {
    const result: { key: IDBValidKey; value: T }[] = [];

    return new Promise((resolve, reject) => {
      this.openCursor<T>(
        storeName,
        (value, cursor) => {
          const hasMore = value != null && typeof value !== 'undefined' && typeof cursor?.key !== 'undefined';
          if (hasMore) {
            result.push({ key: cursor?.key, value: value });
            cursor.continue();
          } else {
            resolve(result);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  public openCursor<T>(storeName: string, handler: CursorHandler<T>, errorHandler: CursorErrorHandler): void {
    try {
      const db = this.getDatabase();
      const store = db.transaction(storeName, 'readonly').objectStore(storeName);
      const cursorReq = store.openCursor();

      cursorReq.onsuccess = () => {
        handler(cursorReq.result?.value ?? null, cursorReq.result);
      };

      cursorReq.onerror = () => {
        errorHandler(cursorReq.error);
      };
    } catch (err) {
      errorHandler(err);
    }
  }

  public openIndexCursor<T>(storeName: string, indexName: string, keyRange: IDBKeyRange, handler: CursorHandler<T>, errorHandler: CursorErrorHandler): void {
    try {
      const db = this.getDatabase();
      const store = db.transaction(storeName, 'readonly').objectStore(storeName);
      const index = store.index(indexName);
      const cursorReq = index.openCursor(keyRange);

      cursorReq.onsuccess = () => {
        handler(cursorReq.result?.value ?? null, cursorReq.result);
      };

      cursorReq.onerror = () => {
        errorHandler(cursorReq.error);
      };
    } catch (err) {
      errorHandler(err);
    }
  }

  public async clearDatabase() {
    const protectedStores: string[] = [ObjectStore.Migrations];
    const db = this.getDatabase();
    for (const storeName of db.objectStoreNames) {
      if (protectedStores.includes(storeName)) {
        continue;
      }

      try {
        const transaction = db.transaction(storeName, 'readwrite', { durability: 'relaxed' });
        const store = transaction.objectStore(storeName);
        store.clear();
        transaction.commit();

        await this.transactionPromise(transaction);
      } catch (err) {
        logger.error('Store deletion error', err);
      }
    }
  }

  private requestPromise<T>(request: IDBRequest<T>): Promise<IDBRequest<T>> {
    return new Promise((resolve, reject) => {
      request.addEventListener('error', () => reject(request.error || new Error('Unexpected error')));
      request.addEventListener('success', () => resolve(request));
    });
  }

  private transactionPromise(transaction: IDBTransaction): Promise<IDBTransaction> {
    return new Promise((resolve, reject) => {
      transaction.addEventListener('error', () => reject(transaction.error || new Error('Unexpected error')));
      transaction.addEventListener('complete', () => resolve(transaction));
    });
  }
}
