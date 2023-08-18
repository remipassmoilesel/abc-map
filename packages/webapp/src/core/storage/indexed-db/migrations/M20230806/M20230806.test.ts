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
import { M20230806 } from './M20230806';
import { GenericReduxIDBEntry } from '../../redux/GenericReduxIDBEntry';
import { AbcLayout, AbcSharedView } from '@abc-map/shared';
import { FeatureIDBEntry } from '../../features/FeatureIDBEntry';
import { FeatureIDBEntryV0 } from '../typings/FeatureIDBEntryV0';
import { TileIDBEntry } from '../../tiles/TileIDBEntry';
import { TileIDBEntryV0 } from '../typings/TileIDBEntryV0';
import { LayerIDBEntry } from '../../layers/LayerIDBEntry';
import { LayerIDBEntryV0 } from '../typings/LayerIDBEntryV0';
import { disableStorageMigrationLogs } from '../StorageUpdater';

disableStorageMigrationLogs();

describe('M20230806', () => {
  let dbName: string;
  let client: IndexedDbClient;
  let migration: M20230806;

  beforeEach(async () => {
    client = new IndexedDbClient();
    dbName = nanoid();

    await client.connect(dbName, 1, (db) => {
      db.createObjectStore(ObjectStore.Projects);
      db.createObjectStore(ObjectStore.Layouts);
      db.createObjectStore(ObjectStore.Layers);
      db.createObjectStore(ObjectStore.SharedViews);
      db.createObjectStore(ObjectStore.Features);
      db.createObjectStore(ObjectStore.Tiles);
    });

    migration = new M20230806();
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

  describe('Layouts', () => {
    it('should do nothing', async () => {
      // Prepare
      const docs: GenericReduxIDBEntry<AbcLayout>[] = [
        {
          version: 99,
          id: 'test-layout-1',
          entry: {
            ...TestHelper.sampleLayout(),
            id: 'test-layout-1',
            textFrames: [{ ...TestHelper.sampleTextFrame(), id: 'test-text-frame-1' }],
          },
        },
      ];

      await client.putAll(
        ObjectStore.Layouts,
        docs.map((entry) => ({ key: entry.id, value: entry.entry }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<GenericReduxIDBEntry<AbcLayout>>(ObjectStore.Layouts);
      expect(entries).toMatchSnapshot();
    });

    it('should migrate', async () => {
      // Prepare
      const docs: AbcLayout[] = [
        {
          ...TestHelper.sampleLayout(),
          id: 'test-layout-1',
          textFrames: [{ ...TestHelper.sampleTextFrame(), id: 'test-text-frame-1' }],
        },
      ];

      await client.putAll(
        ObjectStore.Layouts,
        docs.map((entry) => ({ key: entry.id, value: entry }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<GenericReduxIDBEntry<AbcLayout>>(ObjectStore.Layouts);
      expect(entries).toMatchSnapshot();
    });
  });

  describe('Layers', () => {
    it('should do nothing', async () => {
      // Prepare
      const docs: LayerIDBEntry[] = [
        {
          version: 99,
          layer: {
            ...TestHelper.sampleOsmLayer(),
            metadata: {
              ...TestHelper.sampleOsmLayer().metadata,
              id: 'test-layer-1',
            },
          },
        },
      ];

      await client.putAll(
        ObjectStore.Layers,
        docs.map((entry) => ({ key: entry.layer.metadata.id, value: entry }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<LayerIDBEntry>(ObjectStore.Layers);
      expect(entries).toMatchSnapshot();
    });

    it('should migrate', async () => {
      // Prepare
      const docs: LayerIDBEntryV0[] = [
        {
          layer: {
            ...TestHelper.sampleOsmLayer(),
            metadata: {
              ...TestHelper.sampleOsmLayer().metadata,
              id: 'test-layer-1',
            },
          },
        },
      ];

      await client.putAll(
        ObjectStore.Layers,
        docs.map((entry) => ({ key: entry.layer.metadata.id, value: entry }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<LayerIDBEntry>(ObjectStore.Layers);
      expect(entries).toMatchSnapshot();
    });
  });

  describe('SharedViews', () => {
    it('should do nothing', async () => {
      // Prepare
      const docs: GenericReduxIDBEntry<AbcSharedView>[] = [
        {
          version: 99,
          id: 'test-shared-view-1',
          entry: {
            ...TestHelper.sampleSharedView(),
            id: 'test-shared-view-1',
            textFrames: [{ ...TestHelper.sampleTextFrame(), id: 'test-text-frame-1' }],
          },
        },
      ];

      await client.putAll(
        ObjectStore.SharedViews,
        docs.map((entry) => ({ key: entry.id, value: entry.entry }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<GenericReduxIDBEntry<AbcSharedView>>(ObjectStore.SharedViews);
      expect(entries).toMatchSnapshot();
    });

    it('should migrate', async () => {
      // Prepare
      const docs: AbcSharedView[] = [
        {
          ...TestHelper.sampleSharedView(),
          id: 'test-shared-view-1',
          textFrames: [{ ...TestHelper.sampleTextFrame(), id: 'test-text-frame-1' }],
        },
      ];

      await client.putAll(
        ObjectStore.SharedViews,
        docs.map((entry) => ({ key: entry.id, value: entry }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<GenericReduxIDBEntry<AbcSharedView>>(ObjectStore.SharedViews);
      expect(entries).toMatchSnapshot();
    });
  });

  describe('Features', () => {
    it('should do nothing', async () => {
      // Prepare
      const docs: FeatureIDBEntry[] = [
        {
          version: 99,
          layerId: 'test-layer-id-1',
          feature: {
            ...TestHelper.sampleGeojsonFeature(),
            id: 'sample-feature-id',
          },
        },
      ];

      await client.putAll(
        ObjectStore.Features,
        docs.map((entry) => ({ key: entry.feature.id as string, value: entry }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<FeatureIDBEntry>(ObjectStore.Features);
      expect(entries).toMatchSnapshot();
    });

    it('should migrate', async () => {
      // Prepare
      const docs: FeatureIDBEntryV0[] = [
        {
          layerId: 'test-layer-id-1',
          feature: {
            ...TestHelper.sampleGeojsonFeature(),
            id: 'sample-feature-id',
          },
        },
      ];

      await client.putAll(
        ObjectStore.Features,
        docs.map((entry) => ({ key: entry.feature.id as string, value: entry }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<FeatureIDBEntry>(ObjectStore.Features);
      expect(entries).toMatchSnapshot();
    });
  });

  describe('Tiles', () => {
    it('should do nothing', async () => {
      // Prepare
      const docs: TileIDBEntry[] = [
        {
          version: 99,
          url: 'http://1',
          image: 'blob data 1' as unknown as Blob,
        },
      ];

      await client.putAll(
        ObjectStore.Tiles,
        docs.map((entry) => ({ key: entry.url, value: entry }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<FeatureIDBEntry>(ObjectStore.Tiles);
      expect(entries).toMatchSnapshot();
    });

    it('should migrate', async () => {
      // Prepare
      const docs: TileIDBEntryV0[] = [
        {
          url: 'http://1',
          image: 'blob data 1' as unknown as Blob,
        },
      ];

      await client.putAll(
        ObjectStore.Tiles,
        docs.map((entry) => ({ key: entry.url, value: entry.image }))
      );

      // Act
      await migration.process({ client });

      // Assert
      const entries = await client.getAll<FeatureIDBEntry>(ObjectStore.Tiles);
      expect(entries).toMatchSnapshot();
    });
  });
});
