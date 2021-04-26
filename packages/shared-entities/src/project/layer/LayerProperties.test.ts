import { assert } from 'chai';
import { LayerProperties, PredefinedLayerProperties, WmsLayerProperties } from './LayerProperties';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('LayerProperties', () => {
  it('LayerProperties should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"Id":"abc:layer:id","Name":"abc:layer:name","Active":"abc:layer:active","Type":"abc:layer:type","Managed":"abc:layer:managed","LastLayerChange":"abc:layers:last-change"}';
    /* eslint-enable */

    assert.equal(JSON.stringify(LayerProperties), witness);
  });

  it('PredefinedLayerProperties should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"Model":"abc:layer:predefined:model"}';
    /* eslint-enable */

    assert.equal(JSON.stringify(PredefinedLayerProperties), witness);
  });

  it('WmsLayerProperties should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"Url":"abc:layer:wms:url","LayerName":"abc:layer:wms:layer-name","Username":"abc:layer:wms:username","Password":"abc:layer:wms:password","Projection":"abc:layer:wms:projection","Extent":"abc:layer:wms:extent"}';
    /* eslint-enable */

    assert.equal(JSON.stringify(WmsLayerProperties), witness);
  });
});
