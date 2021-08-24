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
import { TestHelper } from '../../utils/test/TestHelper';
import { deepFreeze } from '../../utils/deepFreeze';
import { Views } from '../../geo/Views';

describe('FromV010ToV020', () => {
  let migration: FromV010ToV020;
  beforeEach(() => {
    migration = new FromV010ToV020();
  });

  it('interestedBy() should return true if version < 0.2', async () => {
    expect(await migration.interestedBy(fakeProject('0.1'))).toEqual(true);
    expect(await migration.interestedBy(fakeProject('0.1.0'))).toEqual(true);
    expect(await migration.interestedBy(fakeProject('0.2.0'))).toEqual(false);
    expect(await migration.interestedBy(fakeProject('0.3.0'))).toEqual(false);
  });

  it('migrate should work', async () => {
    // Prepare
    const original = TestHelper.sampleProjectManifest();
    original.metadata.version = '0.1';
    original.view = undefined as any;
    deepFreeze(original);

    // Act
    const result = await migration.migrate(original, []);

    // Assert
    expect(result.manifest.metadata).toEqual({ ...original.metadata, version: '0.2.0' });
    expect(result.manifest.layers).toEqual(original.layers);
    expect(result.manifest.layouts).toEqual(original.layouts);
    expect(result.manifest.view).toEqual(Views.defaultView());
  });
});

function fakeProject(version: string): AbcProjectManifest {
  return { metadata: { version } } as unknown as AbcProjectManifest;
}
