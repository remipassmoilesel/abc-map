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

import { LayerWrapper, VectorLayerWrapper } from '../../geo/layers/LayerWrapper';
import { AbcLayer, LayerType, Logger } from '@abc-map/shared';
import { IndexedDbClient } from '../indexed-db/IndexedDbClient';
import { ObjectStore } from './ObjectStore';
import { getProjectsDbClient } from './projects-database';
import { LayerDbStorageEntry } from './LayerDbStorageEntry';
import { FeatureDbStorage } from './FeatureDbStorage';

export const logger = Logger.get('LayerDbStorage.ts');

const LayerStorage_LayerListener = 'AbcMap_LayerDbStorage_LayerListener';

const LayerStorageKey = 'LayerStorageKey';
const FeatureStorageKey = 'FeatureStorageKey';

export class LayerDbStorage {
  public static create(): LayerDbStorage {
    return new LayerDbStorage(getProjectsDbClient);
  }

  public static isStorageEnabled(layer: LayerWrapper): boolean {
    return !!layer.unwrap().get(LayerStorageKey);
  }

  public static enableTileLayerStorage(layer: LayerWrapper): void {
    const layerStorage = LayerDbStorage.create();
    layerStorage.watch(layer);

    layer.unwrap().set(LayerStorageKey, layerStorage);
  }

  public static enableVectorLayerStorage(layer: VectorLayerWrapper): void {
    const layerId = layer.getId();
    if (!layerId) {
      throw new Error('Layer id is mandatory');
    }

    const layerStorage = LayerDbStorage.create();
    layerStorage.watch(layer);

    const featureStorage = FeatureDbStorage.create();
    featureStorage.watch(layer);

    layer.unwrap().set(LayerStorageKey, layerStorage);
    layer.unwrap().set(FeatureStorageKey, featureStorage);
  }

  public static disableTileLayerStorage(layer: LayerWrapper): void {
    const layerStorage = layer.unwrap().get(LayerStorageKey) as LayerDbStorage | undefined;
    if (layerStorage && !!layerStorage.unwatch) {
      layerStorage.unwatch(layer);
    }
  }

  public static disableVectorLayerStorage(layer: VectorLayerWrapper): void {
    const layerStorage = layer.unwrap().get(LayerStorageKey) as LayerDbStorage | undefined;
    if (layerStorage && !!layerStorage.unwatch) {
      layerStorage.unwatch(layer);
    }

    const featureStorage = layer.unwrap().get(FeatureStorageKey) as FeatureDbStorage | undefined;
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

    await this.client().put<LayerDbStorageEntry>(ObjectStore.Layers, layerId, { layer: abcLayer });
  }

  public async getAll(ids: string[]): Promise<AbcLayer[]> {
    return this.client()
      .getAll<LayerDbStorageEntry>(ObjectStore.Layers, ids)
      .then((result) => result.map((entry) => entry.layer));
  }
}
