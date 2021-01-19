import { AbcPredefinedLayer, AbcVectorLayer, LayerType, PredefinedLayerModel } from './AbcLayer';
import { assert } from 'chai';

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

    assert.equal(JSON.stringify(current), witness);
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

    assert.equal(JSON.stringify(currentLayer), layerWitness);

    const modelsWitness = '["OSM"]';
    const currentModels = [PredefinedLayerModel.OSM];

    assert.equal(JSON.stringify(currentModels), modelsWitness);
  });
});
