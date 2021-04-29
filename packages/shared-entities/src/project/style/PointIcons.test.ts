import { assert } from 'chai';
import { PointIcons } from './PointIcons';

describe('PointIcons', () => {
  it('Modifications needs data migration', () => {
    const witness = '{"Square":"square","Circle":"circle","Star":"star"}';
    assert.equal(JSON.stringify(PointIcons), witness);
  });
});
