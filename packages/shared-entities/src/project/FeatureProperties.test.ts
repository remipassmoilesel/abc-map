import { assert } from 'chai';
import { FeatureProperties } from './FeatureProperties';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('FeatureProperties', () => {
  it('should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"Selected":"abc:feature:selected"}';
    /* eslint-enable */

    assert.equal(JSON.stringify(FeatureProperties), witness);
  });
});
