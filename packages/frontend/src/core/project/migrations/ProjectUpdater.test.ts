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

import { ProjectUpdater } from './ProjectUpdater';
import { MigratedProject, ProjectMigration } from './typings';
import sinon, { SinonStubbedInstance } from 'sinon';
import { AbcFile, AbcProjectManifest } from '@abc-map/shared';
import { TestHelper } from '../../utils/test/TestHelper';

describe('ProjectUpdater', () => {
  let migration: SinonStubbedInstance<TestProjectMigration>;
  let updater: ProjectUpdater;

  beforeEach(() => {
    migration = sinon.createStubInstance(TestProjectMigration);
    updater = new ProjectUpdater(() => [migration as unknown as ProjectMigration]);
  });

  it('update() should do nothing if project is up to date', async () => {
    // Prepare
    migration.interestedBy.resolves(false);
    const manifest = TestHelper.sampleProjectManifest();

    // Act
    await updater.update(manifest, []);

    // Assert
    expect(migration.migrate.callCount).toEqual(0);
  });

  it('update() should trigger migration', async () => {
    // Prepare
    migration.interestedBy.resolves(true);
    const manifest = TestHelper.sampleProjectManifest();

    // Act
    await updater.update(manifest, []);

    // Assert
    expect(migration.migrate.callCount).toEqual(1);
    expect(migration.migrate.args[0][0]).toEqual(manifest);
  });
});

export class TestProjectMigration implements ProjectMigration {
  public interestedBy(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public migrate(manifest: AbcProjectManifest, files: AbcFile[]): Promise<MigratedProject> {
    return Promise.resolve({ manifest, files });
  }
}
