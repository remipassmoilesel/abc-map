import { assert } from 'chai';
import { AbcLayout, LayoutFormats } from './AbcLayout';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('AbcLayout', () => {
  it('layout should not change without migration', () => {
    /* eslint-disable */
    const layoutWitness = '{"id":"test-layout-id","name":"Test layout","format":{"name":"Test layout format","width":800,"height":600,"orientation":"portrait"},"view":{"center":[1,2],"resolution":3,"projection":{"name":"EPSG:4326"}}}';
    /* eslint-enable */

    const currentLayout: AbcLayout = {
      id: 'test-layout-id',
      name: 'Test layout',
      format: {
        name: 'Test layout format',
        width: 800,
        height: 600,
        orientation: 'portrait',
      },
      view: {
        center: [1, 2],
        resolution: 3,
        projection: {
          name: 'EPSG:4326',
        },
      },
    };

    assert.equal(JSON.stringify(currentLayout), layoutWitness);
  });

  it('layout formats should not change without migration', () => {
    /* eslint-disable */
    const formatsWitness = '[{"name":"A5 Portrait","width":148,"height":210,"orientation":"portrait"},{"name":"A5 Paysage","width":210,"height":148,"orientation":"landscape"},{"name":"A4 Portrait","width":210,"height":297,"orientation":"portrait"},{"name":"A4 Paysage","width":297,"height":210,"orientation":"landscape"},{"name":"A3 Portrait","width":297,"height":420,"orientation":"portrait"},{"name":"A3 Paysage","width":420,"height":297,"orientation":"landscape"}]';
    /* eslint-enable */

    assert.equal(JSON.stringify(LayoutFormats.ALL), formatsWitness);
  });
});
