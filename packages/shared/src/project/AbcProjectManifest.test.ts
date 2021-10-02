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

import { AbcProjectManifest } from './AbcProjectManifest';
import { LegendDisplay } from './legend';
import { GeometryType } from './feature';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('AbcProjectManifest', () => {
  it('should not change without migration', () => {
    /* eslint-disable */
    const witness = '{"metadata":{"id":"test-project-id","version":"0.1","name":"Test project","containsCredentials":false},"layers":[],"layouts":[],"legend":{"display":"BottomRightCorner","width":300,"height":500,"items":[{"id":"test-id","text":"Test text","symbol":{"geomType":"Polygon","properties":{"stroke":{"width":1,"color":"#FFF"}}}}]},"view":{"center":[1,2],"resolution":1000,"projection":{"name":"EPSG:4326"}}}';
    /* eslint-enable */

    const current: AbcProjectManifest = {
      metadata: {
        id: 'test-project-id',
        version: '0.1',
        name: 'Test project',
        containsCredentials: false,
      },
      layers: [],
      layouts: [],
      legend: {
        display: LegendDisplay.BottomRightCorner,
        width: 300,
        height: 500,
        items: [
          {
            id: 'test-id',
            text: 'Test text',
            symbol: {
              geomType: GeometryType.POLYGON,
              properties: {
                stroke: {
                  width: 1,
                  color: '#FFF',
                },
              },
            },
          },
        ],
      },
      view: {
        center: [1, 2],
        resolution: 1000,
        projection: { name: 'EPSG:4326' },
      },
    };

    expect(JSON.stringify(current)).toEqual(witness);
  });
});
