import { assert } from 'chai';
import { FillPatterns, StyleProperties } from './StyleProperties';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('StyleProperties', () => {
  it('StyleProperties should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"FillPattern":"abc:style:fill:pattern","FillColor1":"abc:style:fill:color1","FillColor2":"abc:style:fill:color2","StrokeColor":"abc:style:stroke:color","StrokeWidth":"abc:style:stroke:width","TextValue":"abc:style:text:value","TextColor":"abc:style:text:color","TextSize":"abc:style:text:size","TextFont":"abc:style:text:font","TextOffsetX":"abc:style:text:offset-x","TextOffsetY":"abc:style:text:offset-y","TextAlignment":"abc:style:text:alignment","PointIcon":"abc:style:point:icon","PointSize":"abc:style:point:size","PointColor":"abc:style:point:color"}';
    /* eslint-enable */

    assert.equal(JSON.stringify(StyleProperties), witness);
  });

  it('FillPatterns should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"Flat":"abc:style:fill:flat","Circles":"abc:style:fill:circles","Squares":"abc:style:fill:squares","HatchingVertical":"abc:style:fill:hatching:vertical","HatchingHorizontal":"abc:style:fill:hatching:horizontal","HatchingObliqueRight":"abc:style:fill:hatching:oblique:right","HatchingObliqueLeft":"abc:style:fill:hatching:oblique:left"}';
    /* eslint-enable */

    assert.equal(JSON.stringify(FillPatterns), witness);
  });
});
