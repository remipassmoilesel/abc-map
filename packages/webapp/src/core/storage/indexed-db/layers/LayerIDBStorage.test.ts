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

import { initMainDatabase } from '../main-database';
import { LayerFactory } from '../../../geo/layers/LayerFactory';
import { LayerIDBStorage, logger } from './LayerIDBStorage';
import { PredefinedLayerModel } from '@abc-map/shared';
import { disableStorageMigrationLogs } from '../migrations/StorageUpdater';

disableStorageMigrationLogs();
logger.disable();

describe('LayerIDBStorage', () => {
  let storage: LayerIDBStorage;

  beforeAll(async () => {
    await initMainDatabase();
  });

  beforeEach(() => {
    storage = LayerIDBStorage.create();
  });

  it('isStorageEnabled()', () => {
    const vectorLayer = LayerFactory.newVectorLayer();
    expect(LayerIDBStorage.isStorageEnabled(vectorLayer)).toEqual(false);

    LayerIDBStorage.enableVectorLayerStorage(vectorLayer);
    expect(LayerIDBStorage.isStorageEnabled(vectorLayer)).toEqual(true);

    const tileLayer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
    expect(LayerIDBStorage.isStorageEnabled(tileLayer)).toEqual(false);

    LayerIDBStorage.enableTileLayerStorage(tileLayer);
    expect(LayerIDBStorage.isStorageEnabled(tileLayer)).toEqual(true);
  });

  it('put() then getAll()', async () => {
    const tileLayer1 = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
    const vectorLayer1 = LayerFactory.newVectorLayer().setName('Vector layer 1');
    const vectorLayer2 = LayerFactory.newVectorLayer().setName('Vector layer 2');

    await storage.put(vectorLayer2);
    await storage.put(vectorLayer1);
    await storage.put(tileLayer1);

    const fetched = await storage.getAll([tileLayer1.getId(), vectorLayer1.getId(), vectorLayer2.getId()] as string[]);
    expect(fetched.map((layer) => layer.metadata.id)).toEqual([tileLayer1.getId(), vectorLayer1.getId(), vectorLayer2.getId()]);
  });
});
