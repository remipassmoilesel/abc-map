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

import { disableStorageMigrationLogs, StorageUpdater } from './StorageUpdater';
import { IndexedDbMigration } from './IndexedDbMigration';
import sinon, { SinonStubbedInstance } from 'sinon';
import { IndexedDbClient } from '../client/IndexedDbClient';
import { MigrationIDBEntry } from './MigrationIDBEntry';
import { ObjectStore } from '../client/ObjectStore';

disableStorageMigrationLogs();

describe('StorageUpdater', () => {
  let clock: sinon.SinonFakeTimers;

  let migration1: SinonStubbedInstance<TestMigration>;
  let migration2: SinonStubbedInstance<TestMigration>;
  let client: SinonStubbedInstance<IndexedDbClient>;
  let storage: StorageUpdater;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    clock.tick(120_000);

    migration1 = sinon.createStubInstance(TestMigration);
    migration2 = sinon.createStubInstance(TestMigration);

    migration1.getName.returns('Migration1');
    migration2.getName.returns('Migration2');

    migration1.process.resolves();
    migration2.process.resolves();

    client = sinon.createStubInstance(IndexedDbClient);

    storage = new StorageUpdater(() => [migration1, migration2]);
  });

  afterEach(() => {
    clock.restore();
  });

  it('should execute all migrations', async () => {
    // Prepare
    client.getAll.resolves([]);

    // Act
    await storage.update(client);

    // Assert
    expect(migration1.process.callCount).toEqual(1);
    expect(migration2.process.callCount).toEqual(1);
    expect(client.put.args).toEqual([
      ['Migrations', 'Migration1', { name: 'Migration1', when: 120000 }],
      ['Migrations', 'Migration2', { name: 'Migration2', when: 120000 }],
    ]);
  });

  it('should skip some migrations', async () => {
    // Prepare
    const docs: MigrationIDBEntry[] = [{ name: 'Migration1', when: Date.now() }];
    client.getAll.resolves(docs.map((doc) => ({ key: doc.name, value: doc })));

    // Act
    await storage.update(client);

    // Assert
    expect(migration1.process.callCount).toEqual(0);
    expect(migration2.process.callCount).toEqual(1);
    expect(client.put.args).toEqual([[ObjectStore.Migrations, 'Migration2', { name: 'Migration2', when: 120000 }]]);
  });
});

class TestMigration implements IndexedDbMigration {
  public getName(): string {
    return '';
  }

  public process(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
