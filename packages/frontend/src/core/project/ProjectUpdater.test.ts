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

import { logger, ProjectUpdater } from './ProjectUpdater';
import { ProjectMigration } from './migrations/typings';
import sinon, { SinonStubbedInstance } from 'sinon';
import { TestHelper } from '../utils/test/TestHelper';
import { ModalService } from '../ui/ModalService';
import { TestData } from './migrations/test-data/TestData';

logger.disable();

describe('ProjectUpdater', () => {
  describe('With fake migrations', () => {
    let migration1: TestProjectMigration;
    let migration2: TestProjectMigration;
    let updater: ProjectUpdater;

    beforeEach(() => {
      migration1 = new TestProjectMigration();
      migration2 = new TestProjectMigration();
      updater = new ProjectUpdater(() => [migration1, migration2]);
    });

    it('update() should do nothing if project is up to date', async () => {
      // Prepare
      migration1.interestedBy.resolves(false);
      migration2.interestedBy.resolves(false);
      const manifest = TestHelper.sampleProjectManifest();

      // Act
      await updater.update(manifest, []);

      // Assert
      expect(migration1.migrate.callCount).toEqual(0);
    });

    it('update() should migrate project if necessary', async () => {
      // Prepare
      migration1.interestedBy.resolves(false);
      migration2.interestedBy.resolves(true);
      const manifest = TestHelper.sampleProjectManifest();

      // Act
      await updater.update(manifest, []);

      // Assert
      expect(migration2.migrate.callCount).toEqual(1);
      expect(migration2.migrate.args[0]).toEqual([manifest, []]);
    });

    it('update() should pass migrated projects to next migration scripts', async () => {
      // Prepare
      const afterMigration1 = { manifest: { fakeProject: true }, files: [{ fakeFile: true }] };
      migration1.interestedBy.resolves(true);
      migration1.migrate.returns(afterMigration1);

      migration2.interestedBy.resolves(true);

      const manifest = TestHelper.sampleProjectManifest();

      // Act
      await updater.update(manifest, []);

      // Assert
      expect(migration1.migrate.callCount).toEqual(1);
      expect(migration1.migrate.args[0]).toEqual([manifest, []]);
      expect(migration2.migrate.callCount).toEqual(1);
      expect(migration2.migrate.args[0]).toEqual([afterMigration1.manifest, afterMigration1.files]);
    });
  });

  describe('With existing migrations', () => {
    let modal: SinonStubbedInstance<ModalService>;
    let updater: ProjectUpdater;

    beforeEach(() => {
      modal = sinon.createStubInstance(ModalService);
      updater = ProjectUpdater.create(modal as unknown as ModalService);
    });

    it('should migrate', async () => {
      const project = await TestData.project01();

      const result = await updater.update(project.manifest, project.files);

      expect(result.manifest.metadata.version).toEqual('0.6.0');
    });
  });
});

export class TestProjectMigration implements ProjectMigration {
  public interestedBy = sinon.stub();
  public migrate = sinon.stub();
}
