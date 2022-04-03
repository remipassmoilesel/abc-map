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

import { MongodbClient } from '../MongodbClient';
import { MigrationDao } from './MigrationDao';
import { DatabaseMigrationScript } from './DatabaseMigrationScript';
import * as sinon from 'sinon';
import { DbMigrationsLauncher, logger } from './DbMigrationsLauncher';
import { assert } from 'chai';
import { SinonStubbedInstance } from 'sinon';

logger.disable();

describe('DbMigrationsLauncher', () => {
  let client: SinonStubbedInstance<MongodbClient>;
  let dao: SinonStubbedInstance<MigrationDao>;
  let script: SinonStubbedInstance<DatabaseMigrationScript>;
  let launcher: DbMigrationsLauncher;

  beforeEach(() => {
    client = sinon.createStubInstance(MongodbClient);
    dao = sinon.createStubInstance(MigrationDao);
    script = sinon.createStubInstance(FakeMigration);
    launcher = new DbMigrationsLauncher(client as unknown as MongodbClient, dao as unknown as MigrationDao, [script as unknown as DatabaseMigrationScript]);
  });

  it('migrate should execute then persist script name', async () => {
    // Prepare
    script.getName.returns('Script2');
    dao.findAll.resolves([{ _id: 'test-id', name: 'Script1', when: new Date() }]);

    // Act
    await launcher.migrate();

    // Assert
    assert.deepEqual(dao.init.callCount, 1);
    assert.deepEqual(script.migrate.callCount, 1);
    assert.deepEqual(dao.insert.callCount, 1);
    assert.deepEqual(dao.insert.args[0][0].name, 'Script2');
    assert.deepEqual(client.disconnect.callCount, 1);
  });

  it('migrate should not execute if already executed', async () => {
    // Prepare
    script.getName.returns('Script1');
    dao.findAll.resolves([{ _id: 'test-id', name: 'Script1', when: new Date() }]);

    // Act
    await launcher.migrate();

    // Assert
    assert.deepEqual(dao.init.callCount, 1);
    assert.deepEqual(script.migrate.callCount, 0);
    assert.deepEqual(dao.insert.callCount, 0);
    assert.deepEqual(client.disconnect.callCount, 1);
  });

  it('migrate should handle errors then disconnect from mongodb ', async () => {
    // Prepare
    script.migrate.rejects(new Error('Test error'));
    dao.findAll.resolves([]);

    // Act
    const error = await launcher.migrate().catch((err) => err);

    // Assert
    assert.instanceOf(error, Error);
    assert.deepEqual(error.message, 'Test error');
    assert.deepEqual(dao.init.callCount, 1);
    assert.deepEqual(script.migrate.callCount, 1);
    assert.deepEqual(dao.insert.callCount, 0);
    assert.deepEqual(client.disconnect.callCount, 1);
  });
});

class FakeMigration implements DatabaseMigrationScript {
  public getName(): string {
    return '';
  }

  public migrate(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
