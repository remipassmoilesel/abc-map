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

import { AbcPredefinedLayer, AbcVectorLayer, AbcWmsLayer, AbcXyzLayer, LayerType, PredefinedLayerModel } from './AbcLayer';

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
    const modelsWitness = '"{\\"OSM\\":\\"OSM\\",\\"StamenToner\\":\\"StamenToner\\",\\"StamenTonerLite\\":\\"StamenTonerLite\\",\\"StamenTerrain\\":\\"StamenTerrain\\",\\"StamenWatercolor\\":\\"StamenWatercolor\\"}"';
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
    const currentModels = JSON.stringify(PredefinedLayerModel);

    expect(JSON.stringify(currentLayer)).toEqual(layerWitness);
    expect(JSON.stringify(currentModels)).toEqual(modelsWitness);
  });

  it('WMS layer should not change without migration', () => {
    /* eslint-disable */
    const layerWitness = '{"type":"Wms","metadata":{"id":"test-layer-id","name":"Test wms layer","active":true,"visible":true,"opacity":0.5,"type":"Wms","auth":{"username":"test-username","password":"test-password"},"extent":[1,1,1,1],"projection":{"name":"EPSG:4326"},"remoteLayerName":"test-remoteLayerName","remoteUrls":["test-remoteUrls"]}}';
    /* eslint-enable */

    const currentLayer: AbcWmsLayer = {
      type: LayerType.Wms,
      metadata: {
        id: 'test-layer-id',
        name: 'Test wms layer',
        active: true,
        visible: true,
        opacity: 0.5,
        type: LayerType.Wms,
        auth: {
          username: 'test-username',
          password: 'test-password',
        },
        extent: [1, 1, 1, 1],
        projection: { name: 'EPSG:4326' },
        remoteLayerName: 'test-remoteLayerName',
        remoteUrls: ['test-remoteUrls'],
      },
    };

    expect(JSON.stringify(currentLayer)).toEqual(layerWitness);
  });

  it('XYZ layer should not change without migration', () => {
    /* eslint-disable */
    const layerWitness = '{"type":"Xyz","metadata":{"id":"test-layer-id","name":"Test wms layer","active":true,"visible":true,"opacity":0.5,"type":"Xyz","remoteUrl":"test-remoteUrl"}}';
    /* eslint-enable */

    const currentLayer: AbcXyzLayer = {
      type: LayerType.Xyz,
      metadata: {
        id: 'test-layer-id',
        name: 'Test wms layer',
        active: true,
        visible: true,
        opacity: 0.5,
        type: LayerType.Xyz,
        remoteUrl: 'test-remoteUrl',
      },
    };

    expect(JSON.stringify(currentLayer)).toEqual(layerWitness);
  });
});
