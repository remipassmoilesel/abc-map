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

import { AbcTextFrame } from './AbcTextFrame';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('AbcTextFrame', () => {
  it('should not change without migration', () => {
    const actual: AbcTextFrame = {
      id: 'test-id',
      position: { x: 10, y: 20 },
      size: { width: 30, height: 40 },
      content: [{ type: 'paragraph', children: [{ text: '' }] }],
      style: {
        withBorders: true,
        withShadows: true,
        background: '#FFFFFF',
      },
    };

    expect(actual).toMatchSnapshot();
  });
});
