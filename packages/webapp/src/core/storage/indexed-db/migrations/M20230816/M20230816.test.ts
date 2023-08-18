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

import { ProjectIDBEntryV0 } from '../typings/ProjectIDBEntryV0';
import { ObjectStore } from '../../client/ObjectStore';
import { ProjectIDBEntry } from '../../projects/ProjectIDBEntry';
import { IndexedDbClient } from '../../client/IndexedDbClient';
import { nanoid } from 'nanoid';
import { TestHelper } from '../../../../utils/test/TestHelper';
import { M20230816 } from './M20230816';
import { disableStorageMigrationLogs } from '../StorageUpdater';

disableStorageMigrationLogs();

describe('M20230816', () => {
  let dbName: string;
  let client: IndexedDbClient;
  let migration: M20230816;

  beforeEach(async () => {
    client = new IndexedDbClient();
    dbName = nanoid();

    await client.connect(dbName, 1, (db) => {
      db.createObjectStore(ObjectStore.Projects);
    });

    migration = new M20230816();
  });

  afterEach(() => {
    client.disconnect();
  });

  describe('Projects', () => {
    it('should do nothing', async () => {
      // Prepare
      const template = TestHelper.sampleProjectManifest();
      const docs: ProjectIDBEntry[] = [
        {
          version: 99,
          metadata: {
            ...template.metadata,
            id: 'test-project-1',
            name: 'Test project 1',
          },
          view: template.view,
          layerIds: ['layer-id-1', 'layer-id-2', 'layer-id-3'],
          layouts: {
            layoutIds: ['layout-id-1', 'layout-id-2', 'layout-id-3'],
            abcMapAttributionsEnabled: true,
          },
          sharedViews: {
            fullscreen: template.sharedViews.fullscreen,
            mapDimensions: template.sharedViews.mapDimensions,
            viewIds: ['shared-view-id-1', 'shared-view-id-2', 'shared-view-id-3'],
          },
        },
      ];

      await client.putAll(
        ObjectStore.Projects,
        docs.map((entry) => ({ key: entry.metadata.id, value: entry }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<ProjectIDBEntry>(ObjectStore.Projects);
      expect(entries).toMatchSnapshot();
    });

    it('should migrate', async () => {
      // Prepare
      const template = TestHelper.sampleProjectManifest();
      const docs: ProjectIDBEntryV0[] = [
        {
          metadata: {
            ...template.metadata,
            id: 'test-project-1',
            name: 'Test project 1',
            containsCredentials: false,
          },
          view: template.view,
          layerIds: ['layer-id-1', 'layer-id-2', 'layer-id-3'],
          layoutIds: ['layout-id-1', 'layout-id-2', 'layout-id-3'],
          sharedViews: {
            fullscreen: template.sharedViews.fullscreen,
            mapDimensions: template.sharedViews.mapDimensions,
            viewIds: ['shared-view-id-1', 'shared-view-id-2', 'shared-view-id-3'],
          },
        },
      ];

      await client.putAll(
        ObjectStore.Projects,
        docs.map((entry) => ({ key: entry.metadata.id, value: entry }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<ProjectIDBEntry>(ObjectStore.Projects);
      expect(entries).toMatchSnapshot();
    });
  });
});
