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

import { AbcLegend, LegendDisplay } from './AbcLegend';
import { GeometryType } from '../feature';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('AbcLegend', () => {
  it('LegendDisplay should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"Hidden":"Hidden","UpperLeftCorner":"UpperLeftCorner","UpperRightCorner":"UpperRightCorner","BottomRightCorner":"BottomRightCorner","BottomLeftCorner":"BottomLeftCorner"}';
    /* eslint-enable */

    expect(JSON.stringify(LegendDisplay)).toEqual(witness);
  });

  it('AbcLegend should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"id":"test-id","display":"BottomLeftCorner","width":250,"height":150,"items":[{"id":"test-legend-id","text":"Test text","symbol":{"geomType":"Point","properties":{"point":{"icon":"test-icon.svg","color":"black","size":15}}}}]}';
    /* eslint-enable */

    const current: AbcLegend = {
      id: 'test-id',
      display: LegendDisplay.BottomLeftCorner,
      width: 250,
      height: 150,
      items: [
        {
          id: 'test-legend-id',
          text: 'Test text',
          symbol: {
            geomType: GeometryType.POINT,
            properties: {
              point: {
                icon: 'test-icon.svg',
                color: 'black',
                size: 15,
              },
            },
          },
        },
      ],
    };

    expect(JSON.stringify(current)).toEqual(witness);
  });
});