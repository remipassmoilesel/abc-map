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

import { FeatureDbStorage, logger } from './FeatureDbStorage';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import { TestHelper } from '../../../utils/test/TestHelper';
import uuid from 'uuid-random';
import { initProjectDatabase } from '../projects-database';
import sortBy from 'lodash/sortBy';
import { LayerFactory } from '../../../geo/layers/LayerFactory';

logger.disable();

describe('FeatureDbStorage', () => {
  let storage: FeatureDbStorage;

  beforeAll(async () => {
    await initProjectDatabase();
  });

  beforeEach(() => {
    storage = FeatureDbStorage.create();
  });

  it('putAll() then getAllByLayerId()', async () => {
    // Preprare
    const features1 = TestHelper.sampleFeatures().map((f) => FeatureWrapper.from(f).setId().toGeoJSON());
    const features2 = TestHelper.sampleFeatures().map((f) => FeatureWrapper.from(f).setId().toGeoJSON());
    const layerId1 = uuid();
    const layerId2 = uuid();

    // Act
    await storage.putAll(layerId1, features1);
    await storage.putAll(layerId2, features2);
    const fetched = await storage.getAllByLayerId(layerId1);

    // Assert
    expect(sortBy(fetched, 'id')).toEqual(sortBy(features1, 'id'));
  });

  it('deleteAll()', async () => {
    // Prepare
    const features1 = TestHelper.sampleFeatures().map((f) => FeatureWrapper.from(f).setId().toGeoJSON());
    const layerId1 = uuid();

    await storage.putAll(layerId1, features1);

    // Act
    await storage.deleteAll(layerId1, features1.slice(0, 2));

    // Assert
    const fetched = await storage.getAllByLayerId(layerId1);
    expect(fetched).toEqual([features1[2]]);
  });

  it('watch()', async () => {
    // Prepare
    const features1 = TestHelper.sampleFeatures().map((f) => FeatureWrapper.from(f).setId().setSelected(true).unwrap());
    const features2 = TestHelper.sampleFeatures().map((f) => FeatureWrapper.from(f).setId().setSelected(true).unwrap());
    const layer = LayerFactory.newVectorLayer();
    const source = layer.getSource();

    // Act
    storage.watch(layer);
    source.addFeatures(features1);
    source.addFeatures(features2);
    source.removeFeature(features2[0]);
    // We must wait for an internal promise
    await TestHelper.wait(250);

    // Assert
    const fetched = await storage.getAllByLayerId(layer.getId() as string);
    expect(fetched).toHaveLength(5);

    const expected = features1.concat(features2.slice(1)).map((f) => FeatureWrapper.from(f).setSelected(false).toGeoJSON());
    expect(sortBy(fetched, 'id')).toEqual(sortBy(expected, 'id'));
  });

  it('unwatch()', async () => {
    // Prepare
    const features1 = TestHelper.sampleFeatures().map((f) => FeatureWrapper.from(f).setId().setSelected(true).unwrap());
    const layer = LayerFactory.newVectorLayer();
    const source = layer.getSource();

    // Act
    storage.watch(layer);
    storage.unwatch(layer);
    source.addFeatures(features1);
    source.removeFeature(features1[0]);
    // We must wait for an internal promise
    await TestHelper.wait(250);

    // Assert
    const fetched = await storage.getAllByLayerId(layer.getId() as string);
    expect(fetched).toHaveLength(0);
  });
});
