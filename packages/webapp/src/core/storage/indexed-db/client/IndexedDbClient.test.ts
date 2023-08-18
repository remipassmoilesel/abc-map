/**
 * Copyright © 2022 Rémi Pace.
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

import { IndexedDbClient } from './IndexedDbClient';
import { nanoid } from 'nanoid';
import * as sinon from 'sinon';

const TestStore = 'TestStore';
const IndexName = 'TestStore_notFoo';
const IndexKey = 'notFoo';

// WARNING: these tests use fake-indexeddb (https://www.npmjs.com/package/fake-indexeddb)
describe('IndexedDbClient', () => {
  let dbName: string;
  let client: IndexedDbClient;

  beforeEach(async () => {
    client = new IndexedDbClient();
    dbName = nanoid();

    await client.connect(dbName, 1, (db) => {
      const store = db.createObjectStore(TestStore);
      store.createIndex(IndexName, IndexKey);
    });
  });

  afterEach(() => {
    client.disconnect();
  });

  describe('exists()', () => {
    it('should return true', async () => {
      await client.put(TestStore, 'key-1', { foo: 'bar' });

      expect(await client.exists(TestStore, 'key-1')).toEqual(true);
    });

    it('should return false', async () => {
      await client.put(TestStore, 'key-1', { foo: 'bar' });

      expect(await client.exists(TestStore, 'key-2')).toEqual(false);
    });
  });

  it('put() then get()', async () => {
    await client.put(TestStore, 'key-1', { foo: 'bar-1' });

    expect(await client.get(TestStore, 'key-1')).toEqual({ foo: 'bar-1' });
  });

  it('get() should not throw', async () => {
    expect(await client.get(TestStore, 'unknown-key-1')).toEqual(undefined);
  });

  it('putAll()', async () => {
    await client.putAll(TestStore, [
      { key: 'key-1', value: { foo: 'bar-1' } },
      { key: 'key-2', value: { foo: 'bar-2' } },
      { key: 'key-3', value: { foo: 'bar-3' } },
    ]);

    expect(await client.get(TestStore, 'key-1')).toEqual({ foo: 'bar-1' });
    expect(await client.get(TestStore, 'key-2')).toEqual({ foo: 'bar-2' });
    expect(await client.get(TestStore, 'key-3')).toEqual({ foo: 'bar-3' });
  });

  it('openCursor()', async () => {
    await client.putAll(TestStore, [
      { key: 'key-1', value: { foo: 'bar-1' } },
      { key: 'key-2', value: { foo: 'bar-2' } },
      { key: 'key-3', value: { foo: 'bar-3' } },
    ]);

    const stub = sinon.stub();

    return new Promise<void>((resolve, reject) => {
      client.openCursor(
        TestStore,
        (value, cursor) => {
          // We store values for assertions. Since cursor contains circular references, we keep the type only.
          stub(value, typeof cursor);

          if (cursor) {
            cursor.continue();
          } else {
            try {
              expect(stub.args).toEqual([
                [{ foo: 'bar-1' }, 'object'],
                [{ foo: 'bar-2' }, 'object'],
                [{ foo: 'bar-3' }, 'object'],
                [null, 'object'],
              ]);
              resolve();
            } catch (err) {
              reject(err);
            }
          }
        },
        reject
      );
    });
  });

  it('openIndexCursor()', async () => {
    await client.putAll(TestStore, [
      { key: 'key-1', value: { foo: 'bar-1', [IndexKey]: 'notBar-1' } },
      { key: 'key-2', value: { foo: 'bar-2', [IndexKey]: 'notBar-1' } },
      { key: 'key-3', value: { foo: 'bar-3', [IndexKey]: 'notBar-2' } },
      { key: 'key-4', value: { foo: 'bar-4', [IndexKey]: 'notBar-2' } },
    ]);

    const stub = sinon.stub();

    return new Promise<void>((resolve, reject) => {
      client.openIndexCursor(
        TestStore,
        IndexName,
        IDBKeyRange.only('notBar-2'),
        (value, cursor) => {
          // We store values for assertions. Since cursor contains circular references, we keep the type only.
          stub(value, typeof cursor);

          if (cursor) {
            cursor.continue();
          } else {
            try {
              expect(stub.args).toEqual([
                [{ foo: 'bar-3', [IndexKey]: 'notBar-2' }, 'object'],
                [{ foo: 'bar-4', [IndexKey]: 'notBar-2' }, 'object'],
                [null, 'object'],
              ]);
              resolve();
            } catch (err) {
              reject(err);
            }
          }
        },
        reject
      );
    });
  });

  it('getAll()', async () => {
    await client.putAll(TestStore, [
      { key: 'key-1', value: { foo: 'bar-1' } },
      { key: 'key-2', value: { foo: 'bar-2' } },
      { key: 'key-3', value: { foo: 'bar-3' } },
    ]);

    expect(await client.getAllByKeys(TestStore, ['key-3', 'key-2', 'key-1'])).toEqual([{ foo: 'bar-3' }, { foo: 'bar-2' }, { foo: 'bar-1' }]);
  });

  it('getAll() should not throw', async () => {
    expect(await client.getAllByKeys(TestStore, ['unknown-key-1'])).toEqual([]);
  });
});
