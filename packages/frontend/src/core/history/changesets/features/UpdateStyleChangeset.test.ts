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

import { UpdateStyleChangeset } from './UpdateStyleChangeset';
import { TestHelper } from '../../../utils/test/TestHelper';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import { FeatureStyle } from '@abc-map/shared';

describe('UpdateStyleChangeset', function () {
  let feature: FeatureWrapper;
  let before: FeatureStyle;
  let after: FeatureStyle;
  let changeset: UpdateStyleChangeset;

  beforeEach(() => {
    feature = FeatureWrapper.create();
    before = TestHelper.sampleStyleProperties();
    before.stroke = {
      ...before.stroke,
      width: 10,
    };

    after = TestHelper.sampleStyleProperties();
    after.stroke = {
      ...before.stroke,
      width: 20,
    };

    changeset = new UpdateStyleChangeset([{ feature, before, after }]);
  });

  it('should undo', async () => {
    await changeset.undo();

    expect(feature.getStyleProperties().stroke?.width).toEqual(10);
  });

  it('should redo', async () => {
    await changeset.apply();

    expect(feature.getStyleProperties().stroke?.width).toEqual(20);
  });
});
