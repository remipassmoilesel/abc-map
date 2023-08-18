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

import { Logger } from '@abc-map/shared';
import { IndexedDbClient, KvPair } from '../client/IndexedDbClient';
import { ObjectStore } from '../client/ObjectStore';
import { Feature } from 'ol';
import { VectorLayerWrapper } from '../../../geo/layers/LayerWrapper';
import { VectorSourceEvent } from 'ol/source/Vector';
import { Geometry } from 'ol/geom';
import { CURRENT_VERSION, FeatureIDBEntry } from './FeatureIDBEntry';
import { Features_LayerIdIndex, getMainDbClient } from '../main-database';
import { GeoJSONFeature } from 'ol/format/GeoJSON';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import { throttleDbStorage } from '../client/throttleDbStorage';

export const logger = Logger.get('FeatureIDBStorage.ts');

export function disableFeatureStorageLog() {
  logger.disable();
}

const AddFeatureListenerKey = 'abc:feature-storage:add-feature-listener';
const ChangeFeatureListenerKey = 'abc:feature-storage:change-feature-listener';
const RemoveFeaturesListenerKey = 'abc:feature-storage:remove-feature-listener';

export class FeatureIDBStorage {
  public static create(): FeatureIDBStorage {
    return new FeatureIDBStorage(getMainDbClient);
  }

  constructor(private client: () => IndexedDbClient) {}

  public watch(layer: VectorLayerWrapper): void {
    const source = layer.getSource();
    const layerId = layer.getId();
    if (!layerId) {
      throw new Error('Layer id is mandatory');
    }

    const serializeFeature = (f: Feature): GeoJSONFeature => FeatureWrapper.from(f).clone().setSelected(false).toGeoJSON();

    const addFeaturesHandler = (ev: VectorSourceEvent<Geometry>) => {
      const start = Date.now();
      const features: GeoJSONFeature[] = [ev.feature, ...(ev.features ?? [])].filter((f): f is Feature => !!f).map(serializeFeature);

      this.putAll(layerId, features)
        .catch((err) => logger.error('Storage error: ', err))
        .finally(() => logger.debug(`Saved features in ${Date.now() - start}ms`, { features, layerId }));
    };

    const removeFeaturesHandler = (ev: VectorSourceEvent<Geometry>) => {
      const start = Date.now();
      const features: GeoJSONFeature[] = [ev.feature, ...(ev.features ?? [])]
        .filter((f): f is Feature => !!f)
        .map((feature) => FeatureWrapper.from(feature).toGeoJSON());

      this.deleteAll(layerId, features)
        .catch((err) => logger.error('Storage error: ', err))
        .finally(() => logger.debug(`Saved features in ${Date.now() - start}ms`, { features, layerId }));
    };

    source.on('addfeature', addFeaturesHandler);
    source.set(AddFeatureListenerKey, addFeaturesHandler);

    // We throttle because when user drag shapes there is A LOT of events
    // But we must keep a very low wait value because otherwise some changes will not be saved
    const changeFeatureListener = throttleDbStorage(addFeaturesHandler, 500);
    source.on('changefeature', changeFeatureListener);
    source.set(ChangeFeatureListenerKey, changeFeatureListener);

    source.on('removefeature', removeFeaturesHandler);
    source.set(RemoveFeaturesListenerKey, removeFeaturesHandler);

    // We save once the first time
    this.putAll(layerId, layer.getSource().getFeatures().map(serializeFeature)).catch((err) => logger.error('Storage error: ', err));
  }

  public unwatch(layer: VectorLayerWrapper): void {
    const source = layer.getSource();

    source.un('addfeature', source.get(AddFeatureListenerKey));
    source.un('changefeature', source.get(ChangeFeatureListenerKey));
    source.un('removefeature', source.get(RemoveFeaturesListenerKey));

    source.unset(AddFeatureListenerKey);
    source.unset(ChangeFeatureListenerKey);
    source.unset(RemoveFeaturesListenerKey);
  }

  public async putAll(layerId: string, features: GeoJSONFeature[]): Promise<void> {
    const updates: KvPair<FeatureIDBEntry>[] = features
      .map<KvPair | null>((feature) => {
        if (!feature.id) {
          logger.warn('Warning: this feature does not have an id, it will not be saved');
          return null;
        }

        const entry: FeatureIDBEntry = { version: CURRENT_VERSION, layerId, feature };
        return { key: feature.id, value: entry };
      })
      .filter((u): u is KvPair<FeatureIDBEntry> => !!u);

    await this.client().putAll<FeatureIDBEntry>(ObjectStore.Features, updates);
  }

  public async deleteAll(layerId: string, features: GeoJSONFeature[]): Promise<void> {
    const featureIds = features.map((feature) => feature.id).filter((id): id is string | number => typeof id !== 'undefined');
    await this.client().deleteAll(ObjectStore.Features, featureIds);
  }

  public getAllByLayerId(layerId: string): Promise<GeoJSONFeature[]> {
    const result: GeoJSONFeature[] = [];

    return new Promise<GeoJSONFeature[]>((resolve, reject) => {
      this.client().openIndexCursor<FeatureIDBEntry>(
        ObjectStore.Features,
        Features_LayerIdIndex,
        IDBKeyRange.only(layerId),
        (entry, cursor) => {
          if (entry) {
            result.push(entry.feature);

            cursor?.continue();
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
}
