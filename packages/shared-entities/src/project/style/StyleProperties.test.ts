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
