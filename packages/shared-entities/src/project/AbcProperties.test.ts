import { assert } from 'chai';
import { AbcProperties } from './AbcProperties';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('AbcProperties', () => {
  it('should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"Managed":"abc:managed","LastLayerChange":"abc:layers:last-change","CurrentTool":"abc:map:current-tool"}';
    /* eslint-enable */

    assert.equal(JSON.stringify(AbcProperties), witness);
  });
});
