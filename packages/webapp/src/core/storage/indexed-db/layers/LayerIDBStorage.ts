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

import { LayerWrapper, VectorLayerWrapper } from '../../../geo/layers/LayerWrapper';
import { AbcLayer, LayerType, Logger } from '@abc-map/shared';
import { IndexedDbClient } from '../client/IndexedDbClient';
import { ObjectStore } from '../client/ObjectStore';
import { getMainDbClient } from '../main-database';
import { CURRENT_VERSION, LayerIDBEntry } from './LayerIDBEntry';
import { FeatureIDBStorage } from '../features/FeatureIDBStorage';

export const logger = Logger.get('LayerIDBStorage.ts');

const LayerStorage_LayerListener = 'AbcMap_LayerIDBStorage_LayerListener';

const LayerStorageKey = 'LayerStorageKey';
const FeatureStorageKey = 'FeatureStorageKey';

export class LayerIDBStorage {
  public static create(): LayerIDBStorage {
    return new LayerIDBStorage(getMainDbClient);
  }

  public static isStorageEnabled(layer: LayerWrapper): boolean {
    return !!layer.unwrap().get(LayerStorageKey);
  }

  public static enableTileLayerStorage(layer: LayerWrapper): void {
    const layerStorage = LayerIDBStorage.create();
    layerStorage.watch(layer);

    layer.unwrap().set(LayerStorageKey, layerStorage);
  }

  public static enableVectorLayerStorage(layer: VectorLayerWrapper): void {
    const layerId = layer.getId();
    if (!layerId) {
      throw new Error('Layer id is mandatory');
    }

    const layerStorage = LayerIDBStorage.create();
    layerStorage.watch(layer);

    const featureStorage = FeatureIDBStorage.create();
    featureStorage.watch(layer);

    layer.unwrap().set(LayerStorageKey, layerStorage);
    layer.unwrap().set(FeatureStorageKey, featureStorage);
  }

  public static disableTileLayerStorage(layer: LayerWrapper): void {
    const layerStorage = layer.unwrap().get(LayerStorageKey) as LayerIDBStorage | undefined;
    if (layerStorage && !!layerStorage.unwatch) {
      layerStorage.unwatch(layer);
    }
  }

  public static disableVectorLayerStorage(layer: VectorLayerWrapper): void {
    const layerStorage = layer.unwrap().get(LayerStorageKey) as LayerIDBStorage | undefined;
    if (layerStorage && !!layerStorage.unwatch) {
      layerStorage.unwatch(layer);
    }

    const featureStorage = layer.unwrap().get(FeatureStorageKey) as FeatureIDBStorage | undefined;
    if (featureStorage && !!featureStorage.unwatch) {
      featureStorage.unwatch(layer);
    }
  }

  constructor(private client: () => IndexedDbClient) {}

  public watch(layer: LayerWrapper): void {
    const handler = () => this.put(layer).catch((err) => logger.error('Storage error: ', err));

    layer.unwrap().on('change', handler);
    layer.unwrap().set(LayerStorage_LayerListener, handler);

    // We save once the first time
    this.put(layer).catch((err) => logger.error('Storage error: ', err));
  }

  public unwatch(layer: LayerWrapper): void {
    const handler = layer.unwrap().get(LayerStorage_LayerListener);
    layer.unwrap().un('change', handler);
  }

  public async put(layer: LayerWrapper): Promise<void> {
    const layerId = layer.getId();
    if (!layerId) {
      throw new Error('Layer must have a valid id: ' + layerId);
    }

    let abcLayer: AbcLayer;

    // We export layer. Vector layers are a special case, we do not embed features.
    if (layer.isVector()) {
      const metadata = layer.getMetadata();
      if (!metadata) {
        throw new Error('Invalid layer: ' + layer.getId());
      }

      abcLayer = {
        type: LayerType.Vector,
        metadata,
        features: {
          type: 'FeatureCollection',
          features: [],
        },
      };
    } else {
      abcLayer = await layer.toAbcLayer();
    }

    await this.client().put<LayerIDBEntry>(ObjectStore.Layers, layerId, { version: CURRENT_VERSION, layer: abcLayer });
  }

  public async getAll(ids: string[]): Promise<AbcLayer[]> {
    return this.client()
      .getAllByKeys<LayerIDBEntry>(ObjectStore.Layers, ids)
      .then((result) => result.map((entry) => entry.layer));
  }
}
