/**
 * Copyright © 2022 Rémi Pace.
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

import { TestHelper } from '../../../utils/test/TestHelper';
import { ProjectIDBEntry } from './ProjectIDBEntry';

describe('ProjectIDBEntry', () => {
  it('should not change without migration', () => {
    const template = TestHelper.sampleProjectManifest();
    const entry1: ProjectIDBEntry = {
      metadata: {
        ...template.metadata,
        id: 'test-project-id',
        name: 'Test project',
      },
      layouts: {
        layoutIds: ['layout-id-1', 'layout-id-2'],
        abcMapAttributionsEnabled: true,
      },
      sharedViews: {
        fullscreen: true,
        mapDimensions: {
          width: 888,
          height: 666,
        },
        viewIds: ['view-id-1', 'view-id-2'],
      },
      view: TestHelper.sampleView(),
      version: 2,
      layerIds: ['layer-id-1', 'layer-id-2'],
    };

    expect(entry1).toMatchSnapshot();
  });
});
