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

import { IndexedDbMigration, StorageMigrationContext } from '../IndexedDbMigration';
import { ProjectIDBEntryV0 } from '../typings/ProjectIDBEntryV0';
import { ObjectStore } from '../../client/ObjectStore';
import { ProjectIDBEntry } from '../../projects/ProjectIDBEntry';
import { GenericReduxIDBEntry } from '../../redux/GenericReduxIDBEntry';
import { AbcLayout, AbcSharedView, Logger } from '@abc-map/shared';
import { FeatureIDBEntry } from '../../features/FeatureIDBEntry';
import { KvPair } from '../../client/IndexedDbClient';
import { TileIDBEntry } from '../../tiles/TileIDBEntry';
import { LayerIDBEntry } from '../../layers/LayerIDBEntry';
import { FeatureIDBEntryV0 } from '../typings/FeatureIDBEntryV0';

const NEXT = 2;

const logger = Logger.get('M20230816.ts');

/**
 * This migration:
 * - updates layout structure
 * - add ids on all entities
 */
export class M20230806 implements IndexedDbMigration {
  public getName(): string {
    return 'M20230806';
  }

  public async process(context: StorageMigrationContext): Promise<void> {
    const { client } = context;

    // Projects
    const projects = await client.getAll<ProjectIDBEntryV0>(ObjectStore.Projects);
    const migratedProjects = projects
      .filter((entry) => (entry.value.version ?? 0) < NEXT)
      .map<ProjectIDBEntry>((entry) => {
        const result: ProjectIDBEntry = {
          version: NEXT,
          metadata: {
            ...entry.value.metadata,
            // We must set appropriate version, otherwise schema can be migrated another time at loading
            version: '1.3.0',
          },
          view: entry.value.view,
          layouts: {
            layoutIds: entry.value.layoutIds,
            abcMapAttributionsEnabled: true,
          },
          sharedViews: entry.value.sharedViews,
          layerIds: entry.value.layerIds,
        };

        return result;
      });

    if (migratedProjects.length) {
      await client.putAll<ProjectIDBEntry>(
        ObjectStore.Projects,
        migratedProjects.map((entry) => ({ key: entry.metadata.id, value: entry }))
      );
    }

    // Layouts
    const layouts = await client.getAll<AbcLayout | GenericReduxIDBEntry<AbcLayout>>(ObjectStore.Layouts);
    const migratedLayouts = layouts
      .filter((entry) => ((entry.value as GenericReduxIDBEntry<AbcLayout>).version ?? 0) < NEXT)
      .map<GenericReduxIDBEntry<AbcLayout>>((entry) => {
        return {
          id: entry.value.id,
          version: NEXT,
          entry: entry.value as AbcLayout,
        };
      });

    if (migratedLayouts.length) {
      await client.putAll<GenericReduxIDBEntry<AbcLayout>>(
        ObjectStore.Layouts,
        migratedLayouts.map((entry) => ({ key: entry.id, value: entry }))
      );
    }

    // Layers
    const layers = await client.getAll<LayerIDBEntry>(ObjectStore.Layers);
    const migratedLayers = layers
      .filter((entry) => (entry.value.version ?? 0) < NEXT)
      .map<LayerIDBEntry>((entry) => {
        return {
          version: NEXT,
          layer: entry.value.layer,
        };
      });

    if (migratedLayers.length) {
      await client.putAll<LayerIDBEntry>(
        ObjectStore.Layers,
        migratedLayers.map((entry) => ({ key: entry.layer.metadata.id, value: entry }))
      );
    }

    // Shared views
    const sharedViews = await client.getAll<AbcSharedView | GenericReduxIDBEntry<AbcSharedView>>(ObjectStore.SharedViews);
    const migratedSharedViews = sharedViews
      .filter((entry) => ((entry.value as GenericReduxIDBEntry<AbcSharedView>).version ?? 0) < NEXT)
      .map<GenericReduxIDBEntry<AbcSharedView>>((entry) => {
        return {
          id: entry.value.id,
          version: NEXT,
          entry: entry.value as AbcSharedView,
        };
      });

    if (migratedSharedViews.length) {
      await client.putAll<GenericReduxIDBEntry<AbcSharedView>>(
        ObjectStore.SharedViews,
        migratedSharedViews.map((entry) => ({ key: entry.id, value: entry }))
      );
    }

    // Features
    const features = await client.getAll<FeatureIDBEntryV0>(ObjectStore.Features);
    const migratedFeatures = features
      .filter((entry) => (entry.value.version ?? 0) < NEXT)
      .map<FeatureIDBEntry>((entry) => {
        return {
          version: NEXT,
          layerId: entry.value.layerId,
          feature: entry.value.feature,
        };
      });

    if (migratedFeatures.length) {
      await client.putAll<FeatureIDBEntry>(
        ObjectStore.Features,
        migratedFeatures
          .map<KvPair | null>((feature) => {
            if (!feature.feature.id) {
              logger.warn('Warning: this feature does not have an id, it will not be saved');
              return null;
            }

            return { key: feature.feature.id, value: feature };
          })
          .filter((u): u is KvPair<FeatureIDBEntry> => !!u)
      );
    }

    // Tiles
    const tiles = await client.getAll<Blob>(ObjectStore.Tiles);
    const migratedTiles = tiles
      .filter((entry) => ((entry.value as any).version ?? 0) < NEXT)
      .map<TileIDBEntry | null>((entry) => {
        if (typeof entry.key !== 'string') {
          return null;
        }

        return {
          version: NEXT,
          url: entry.key,
          image: entry.value,
        };
      })
      .filter((v): v is TileIDBEntry => !!v);

    if (migratedTiles.length) {
      await client.putAll<TileIDBEntry>(
        ObjectStore.Tiles,
        migratedTiles.map<KvPair<TileIDBEntry>>((tile) => {
          return { key: tile.url, value: tile };
        })
      );
    }
  }
}
