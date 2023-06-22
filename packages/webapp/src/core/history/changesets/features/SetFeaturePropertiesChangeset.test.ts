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

import { FeatureWrapper, DataPropertiesMap } from '../../../geo/features/FeatureWrapper';
import { SetFeaturePropertiesChangeset } from './SetFeaturePropertiesChangeset';

describe('SetFeaturePropertiesChangeset', function () {
  let feature: FeatureWrapper;
  let before: DataPropertiesMap;
  let after: DataPropertiesMap;
  let changeset: SetFeaturePropertiesChangeset;

  beforeEach(() => {
    feature = FeatureWrapper.create();
    before = { population: 12345 };
    after = { population: 56789 };
    changeset = new SetFeaturePropertiesChangeset(feature, before, after);
  });

  it('should undo', async () => {
    await changeset.undo();

    expect(feature.getDataProperties()).toEqual(before);
  });

  it('should redo', async () => {
    await changeset.execute();

    expect(feature.getDataProperties()).toEqual(after);
  });
});
