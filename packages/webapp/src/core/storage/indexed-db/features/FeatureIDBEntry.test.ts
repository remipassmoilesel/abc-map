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

import { CURRENT_VERSION, FeatureIDBEntry } from './FeatureIDBEntry';

describe('FeatureIDBEntry', () => {
  it('should not change without migration', () => {
    const entry: FeatureIDBEntry = {
      version: CURRENT_VERSION,
      layerId: 'test-layer-id',
      feature: {
        id: 'test-feature-1',
        type: 'Feature',
        bbox: [1, 2, 3, 4],
        geometry: {
          type: 'Point',
          bbox: [1, 2, 3, 4],
          coordinates: [1, 3],
        },
        properties: {
          property1: 'value1',
          property2: 2,
        },
      },
    };

    expect(entry).toMatchSnapshot();
  });
});
