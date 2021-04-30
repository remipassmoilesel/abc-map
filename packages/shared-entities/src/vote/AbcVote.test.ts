import { assert } from 'chai';
import { VoteValue } from './AbcVote';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('AbcVote', () => {
  it('should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"1":"NOT_SATISFIED","2":"BLAH","3":"SATISFIED","NOT_SATISFIED":1,"BLAH":2,"SATISFIED":3}';
    /* eslint-enable */

    assert.equal(JSON.stringify(VoteValue), witness);
  });
});
