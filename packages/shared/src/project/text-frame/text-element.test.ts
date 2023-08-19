/**
 * Copyright © 2023 Rémi Pace.
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

import { AbcElement, AbcText } from './text-elements';
import { AbcGeometryType } from '../feature';

/**
 * If this test fail, you should write a migration script then adapt it
 */
describe('Text elements', () => {
  it('texts should not change without migration', () => {
    const actual: AbcText = {
      text: 'text1',
      size: 4,
      bold: true,
      italic: true,
      underline: true,
      foregroundColor: 'foregroundColor',
      backgroundColor: 'backgroundColor',
    };

    expect(actual).toMatchSnapshot();
  });

  it('elements should not change without migration', () => {
    const actual: AbcElement[] = [
      { type: 'paragraph', align: 'justify', children: [] },
      { type: 'paragraph', align: 'center', children: [] },
      { type: 'paragraph', align: 'left', children: [] },
      { type: 'paragraph', align: 'right', children: [] },
      { type: 'code', children: [] },
      { type: 'quote', children: [] },
      { type: 'title', level: 1, align: 'center', children: [] },
      { type: 'table', children: [] },
      { type: 'table-row', children: [] },
      { type: 'table-cell', children: [] },
      { type: 'video', url: 'http://video.url', children: [{ text: '' }] },
      { type: 'image', url: 'http://image.blob.url', size: 1, children: [{ text: '' }] },
      { type: 'list', ordered: true, children: [] },
      { type: 'list', ordered: false, children: [] },
      { type: 'list-item', children: [] },
      { type: 'link', url: 'http://somewhere.net', children: [] },
      { type: 'map-symbol', style: { fill: { color1: 'red' } }, geometryType: AbcGeometryType.POINT, children: [{ text: '' }] },
    ];

    expect(actual).toMatchSnapshot();
  });
});
