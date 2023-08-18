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
import { FromV120ToV130 } from './FromV120ToV130';

describe('FromV120ToV130', () => {
  let migration: FromV120ToV130;

  beforeEach(async () => {
    migration = new FromV120ToV130();
  });

  it('interestedBy() should return true if version < 1.3.0', async () => {
    const sampleProject = await TestData.project110();

    expect(await migration.interestedBy(sampleProject.manifest)).toEqual(true);
    expect(await migration.interestedBy(TestData.fakeProject('1.3.0'))).toEqual(false);
  });

  it('should migrate', async () => {
    // Prepare
    const sampleProject = await TestData.project110();

    // Act
    const result = await migration.migrate(sampleProject.manifest, sampleProject.files);
    const manifest = result.manifest;

    // Assert
    expect(manifest).toMatchSnapshot();
  });
});
