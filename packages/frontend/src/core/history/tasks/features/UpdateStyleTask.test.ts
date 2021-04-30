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

import { UpdateStyleTask } from './UpdateStyleTask';
import { TestHelper } from '../../../utils/TestHelper';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import { FeatureStyle } from '../../../geo/style/FeatureStyle';

describe('UpdateStyleTask', function () {
  let feature: FeatureWrapper;
  let before: FeatureStyle;
  let after: FeatureStyle;
  let task: UpdateStyleTask;

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

    task = new UpdateStyleTask([{ feature, before, after }]);
  });

  it('should undo', function () {
    task.undo();
    expect(feature.getStyleProperties().stroke?.width).toEqual(10);
  });

  it('should redo', function () {
    task.redo();
    expect(feature.getStyleProperties().stroke?.width).toEqual(20);
  });
});
