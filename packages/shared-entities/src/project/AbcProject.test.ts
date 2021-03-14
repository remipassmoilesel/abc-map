import { AbcProject } from './AbcProject';
import { assert } from 'chai';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('AbcProject', () => {
  it('should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"metadata":{"id":"test-project-id","version":"0.1","name":"Test project","projection":{"name":"EPSG:4326"},"containsCredentials":false},"layers":[],"layouts":[]}';
    /* eslint-enable */

    const current: AbcProject = {
      metadata: {
        id: 'test-project-id',
        version: '0.1',
        name: 'Test project',
        projection: {
          name: 'EPSG:4326',
        },
        containsCredentials: false,
      },
      layers: [],
      layouts: [],
    };

    assert.equal(JSON.stringify(current), witness);
  });
});
