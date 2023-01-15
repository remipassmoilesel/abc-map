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

import { FromV010ToV020 } from './FromV010ToV020';
import { AbcProjectManifest } from '@abc-map/shared';
import { deepFreeze } from '../../utils/deepFreeze';
import { Views } from '../../geo/Views';
import { MigrationProject } from './typings';
import { TestData } from './test-data/TestData';

describe('FromV010ToV020', () => {
  let project: MigrationProject;
  let migration: FromV010ToV020;
  beforeEach(async () => {
    project = await TestData.project01();
    migration = new FromV010ToV020();
  });

  it('interestedBy() should return true', async () => {
    expect(await migration.interestedBy(project.manifest)).toEqual(true);
    expect(await migration.interestedBy(TestData.fakeProject('0.3.0'))).toEqual(false);
  });

  it('migrate should work', async () => {
    // Prepare
    const original = deepFreeze(project.manifest);

    // Act
    const result = await migration.migrate(original as unknown as AbcProjectManifest, []);

    // Assert
    expect(result.manifest.metadata).toEqual({ ...original.metadata, version: '0.2.0' });
    expect(result.manifest.layers).toEqual(original.layers);
    expect(result.manifest.layouts).toEqual(original.layouts);
    expect(result.manifest.view).toEqual(Views.defaultView());
  });
});
