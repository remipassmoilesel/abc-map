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

import { CURRENT_VERSION, LayerIDBEntry } from './LayerIDBEntry';
import { TestHelper } from '../../../utils/test/TestHelper';

describe('LayerIDBEntry', () => {
  it('should not change without migration', () => {
    const entry1: LayerIDBEntry = {
      version: CURRENT_VERSION,
      layer: {
        ...TestHelper.sampleOsmLayer(),
        metadata: {
          ...TestHelper.sampleOsmLayer().metadata,
          id: 'test-layer-1',
        },
      },
    };

    expect(entry1).toMatchSnapshot();

    const entry2: LayerIDBEntry = {
      version: CURRENT_VERSION,
      layer: {
        ...TestHelper.sampleWmsLayer(),
        metadata: {
          ...TestHelper.sampleWmsLayer().metadata,
          id: 'test-layer-1',
        },
      },
    };

    expect(entry2).toMatchSnapshot();

    const entry3: LayerIDBEntry = {
      version: CURRENT_VERSION,
      layer: {
        ...TestHelper.sampleWmtsLayer(),
        metadata: {
          ...TestHelper.sampleWmtsLayer().metadata,
          id: 'test-layer-1',
        },
      },
    };

    expect(entry3).toMatchSnapshot();

    const entry4: LayerIDBEntry = {
      version: CURRENT_VERSION,
      layer: {
        ...TestHelper.sampleXyzLayer(),
        metadata: {
          ...TestHelper.sampleXyzLayer().metadata,
          id: 'test-layer-1',
        },
      },
    };

    expect(entry4).toMatchSnapshot();

    const entry5: LayerIDBEntry = {
      version: CURRENT_VERSION,
      layer: {
        ...TestHelper.sampleVectorLayer(),
        metadata: {
          ...TestHelper.sampleVectorLayer().metadata,
          id: 'test-layer-1',
        },
        features: {
          ...TestHelper.sampleVectorLayer().features,
          features: TestHelper.sampleVectorLayer().features.features.map((feat, i) => ({ ...feat, id: `test-feature-${i}` })),
        },
      },
    };

    expect(entry5).toMatchSnapshot();
  });
});
