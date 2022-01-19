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

import { TestData } from './test-data/TestData';
import { MigratedProject } from './typings';
import { FromV050ToV060 } from './FromV050ToV060';
import { AbcProjectMetadata } from '@abc-map/shared';

describe('FromV050ToV060', () => {
  let sampleProject: MigratedProject;
  let migration: FromV050ToV060;

  beforeEach(async () => {
    sampleProject = await TestData.project050();
    migration = new FromV050ToV060();
  });

  it('interestedBy() should return true if version < 0.6', async () => {
    expect(await migration.interestedBy(sampleProject.manifest)).toEqual(true);
    expect(await migration.interestedBy(TestData.fakeProject('0.6.0'))).toEqual(false);
  });

  it('migrate should work', async () => {
    // Act
    const result = await migration.migrate(sampleProject.manifest, sampleProject.files);

    // Assert
    const expectedMetadata: AbcProjectMetadata = {
      id: sampleProject.manifest.metadata.id,
      version: '0.6.0',
      name: sampleProject.manifest.metadata.name,
      containsCredentials: sampleProject.manifest.metadata.containsCredentials,
      public: false,
    };
    expect(result.manifest.metadata).toEqual(expectedMetadata);

    expect(result.manifest.sharedViews).toEqual([]);
  });
});
