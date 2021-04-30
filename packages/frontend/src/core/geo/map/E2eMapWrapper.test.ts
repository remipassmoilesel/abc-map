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

import { MapFactory } from './MapFactory';
import { E2eMapWrapper } from './E2eMapWrapper';
import { TestHelper } from '../../utils/TestHelper';
import { LayerFactory } from '../layers/LayerFactory';

describe('E2eMapWrapper', function () {
  it('getLayersMetadata()', function () {
    const map = MapFactory.createNaked();
    const e2e = new E2eMapWrapper(map);
    const layer1 = LayerFactory.newOsmLayer();
    const layer2 = LayerFactory.newVectorLayer();
    map.addLayer(layer1);
    map.addLayer(layer2);

    const metadata = e2e.getLayersMetadata();
    expect(metadata).toEqual([layer1.getMetadata(), layer2.getMetadata()]);
  });

  it('getActiveLayerFeatures()', function () {
    const map = MapFactory.createNaked();
    const e2e = new E2eMapWrapper(map);
    const layer1 = LayerFactory.newVectorLayer();
    const layer2 = LayerFactory.newOsmLayer();
    const features = TestHelper.sampleFeatures();
    map.addLayer(layer1);
    map.addLayer(layer2);

    layer1.getSource().addFeatures(features);

    map.setActiveLayer(layer1);
    expect(e2e.getActiveLayerFeatures()).toEqual(features);

    map.setActiveLayer(layer2);
    expect(e2e.getActiveLayerFeatures()).toEqual([]);
  });
});
