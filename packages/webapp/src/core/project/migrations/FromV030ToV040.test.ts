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

import { WmsMetadata } from '@abc-map/shared';
import { TestData } from './test-data/TestData';
import { MigrationProject } from './typings';
import { FromV030ToV040 } from './FromV030ToV040';
import { WmsMetadata030 } from './dependencies/030-project';
import { AbcProjectMetadata040 } from './dependencies/040-project';

describe('FromV030ToV040', () => {
  let sampleProject: MigrationProject;
  let migration: FromV030ToV040;

  beforeEach(async () => {
    sampleProject = await TestData.project030();
    migration = new FromV030ToV040();
  });

  it('interestedBy() should return true if version < 0.4', async () => {
    expect(await migration.interestedBy(sampleProject.manifest)).toEqual(true);
    expect(await migration.interestedBy(TestData.fakeProject('0.4.0'))).toEqual(false);
  });

  it('migrate should work', async () => {
    // Act
    const result = await migration.migrate(sampleProject.manifest, sampleProject.files);

    // Assert
    const expectedMetadata: AbcProjectMetadata040 = {
      id: sampleProject.manifest.metadata.id,
      version: '0.4.0',
      name: sampleProject.manifest.metadata.name,
      containsCredentials: sampleProject.manifest.metadata.containsCredentials,
    };
    expect(result.manifest.metadata).toEqual(expectedMetadata);
    expect(sampleProject.manifest.layers.slice(0, 2)).toEqual(result.manifest.layers.slice(0, 2));

    const metadata = result.manifest.layers[2].metadata as WmsMetadata;
    const originalUrl = (sampleProject.manifest.layers[2].metadata as unknown as WmsMetadata030).remoteUrl;
    expect(metadata.remoteUrls).toEqual([originalUrl]);
  });
});
