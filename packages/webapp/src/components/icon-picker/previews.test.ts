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

import { getPreviews } from './previews';

describe('previews', function () {
  it('should work', () => {
    const previews = getPreviews();

    const keys = Array.from(previews.keys()).sort();
    const valuesCount = keys.map((k) => previews.get(k)?.length);
    expect(keys).toEqual(['Arrows', 'Emojis', 'Geometries', 'Objects', 'Pins', 'Symbols', 'Weather']);
    expect(valuesCount).toEqual([73, 22, 25, 258, 10, 65, 65]);
    keys
      .flatMap((k) => previews.get(k))
      .forEach((p) => {
        expect(p?.icon.name).toBeDefined();
        expect(p?.icon.category).toBeDefined();
        expect(p?.icon.contentSvg).toBeDefined();
      });
  });
});
