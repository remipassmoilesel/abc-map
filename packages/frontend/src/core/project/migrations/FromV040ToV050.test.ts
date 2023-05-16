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
import { MigrationProject } from './typings';
import { FromV040ToV050 } from './FromV040ToV050';
import { AbcProjectMetadata040 } from './dependencies/040-project';

describe('FromV040ToV050', () => {
  let sampleProject: MigrationProject;
  let migration: FromV040ToV050;

  beforeEach(async () => {
    sampleProject = await TestData.project040();
    migration = new FromV040ToV050();
  });

  it('interestedBy() should return true if version < 0.5', async () => {
    expect(await migration.interestedBy(sampleProject.manifest)).toEqual(true);
    expect(await migration.interestedBy(TestData.fakeProject('0.5.0'))).toEqual(false);
  });

  it('migrate should work', async () => {
    // Act
    const result = await migration.migrate(sampleProject.manifest, sampleProject.files);

    // Assert
    const expectedMetadata: AbcProjectMetadata040 = {
      id: sampleProject.manifest.metadata.id,
      version: '0.5.0',
      name: sampleProject.manifest.metadata.name,
      containsCredentials: sampleProject.manifest.metadata.containsCredentials,
    };
    expect(result.manifest.metadata).toEqual(expectedMetadata);

    expect(result.manifest.layouts.map((l) => l.format)).toEqual(
      [
        {
          width: 297,
          height: 210,
          orientation: 'landscape',
          id: 'A4_LANDSCAPE',
        },
        {
          width: 297,
          height: 420,
          orientation: 'portrait',
          id: 'A3_PORTRAIT',
        },
      ].sort()
    );
  });
});
