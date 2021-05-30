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

import { AbcPredefinedLayer, AbcVectorLayer, LayerType, PredefinedLayerModel } from './AbcLayer';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('AbcLayer', () => {
  it('VectorLayer should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"type":"Vector","metadata":{"id":"test-layer-id","name":"Test vector layer","active":true,"visible":true,"opacity":0.5,"type":"Vector"},"features":{"type":"FeatureCollection","bbox":[1,2,3,4],"features":[{"id":"feature-id","type":"Feature","bbox":[5,6,7,8],"properties":{"property1":"value1"},"geometry":{"type":"Point","coordinates":[9,10]}}]}}';
    /* eslint-enable */

    const current: AbcVectorLayer = {
      type: LayerType.Vector,
      metadata: {
        id: 'test-layer-id',
        name: 'Test vector layer',
        active: true,
        visible: true,
        opacity: 0.5,
        type: LayerType.Vector,
      },
      features: {
        type: 'FeatureCollection',
        bbox: [1, 2, 3, 4],
        features: [
          {
            id: 'feature-id',
            type: 'Feature',
            bbox: [5, 6, 7, 8],
            properties: {
              property1: 'value1',
            },
            geometry: {
              type: 'Point',
              coordinates: [9, 10],
            },
          },
        ],
      },
    };

    expect(JSON.stringify(current)).toEqual(witness);
  });

  it('PredefinedLayer should not change without migration', () => {
    /* eslint-disable */
    const layerWitness = '{"type":"Predefined","metadata":{"id":"test-layer-id","name":"Test predefined layer","active":true,"visible":true,"opacity":0.5,"type":"Predefined","model":"OSM"}}';
    /* eslint-enable */

    const currentLayer: AbcPredefinedLayer = {
      type: LayerType.Predefined,
      metadata: {
        id: 'test-layer-id',
        name: 'Test predefined layer',
        active: true,
        visible: true,
        opacity: 0.5,
        type: LayerType.Predefined,
        model: PredefinedLayerModel.OSM,
      },
    };

    expect(JSON.stringify(currentLayer)).toEqual(layerWitness);

    const modelsWitness = '["OSM"]';
    const currentModels = [PredefinedLayerModel.OSM];

    expect(JSON.stringify(currentModels)).toEqual(modelsWitness);
  });
});