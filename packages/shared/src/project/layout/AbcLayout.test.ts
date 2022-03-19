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

import { AbcLayout, LayoutFormats } from './AbcLayout';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('AbcLayout', () => {
  it('layout formats should not change without migration', () => {
    expect(LayoutFormats.All).toMatchSnapshot();
  });

  it('layout should not change without migration', () => {
    const actual: AbcLayout = {
      id: 'test-layout-id',
      name: 'Test layout',
      format: {
        id: 'Test layout format',
        width: 800,
        height: 600,
        orientation: 'portrait',
      },
      view: {
        center: [1, 2],
        resolution: 3,
        projection: {
          name: 'EPSG:4326',
        },
      },
      textFrames: [],
      scale: {
        x: 123,
        y: 456,
      },
    };

    expect(actual).toMatchSnapshot();
  });
});
