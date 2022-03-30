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

import { adaptMapDimensions } from './adaptMapDimensions';
import { TestHelper } from '../utils/test/TestHelper';

describe('adaptMapDimensions()', () => {
  beforeEach(() => {
    TestHelper.fakeAppViewport(888, 666);
  });

  it('should return viewport dimensions if fullscreen', () => {
    const dimensions = adaptMapDimensions(true, { width: 600, height: 400 });

    expect(dimensions).toEqual({ width: 888, height: 666 });
  });

  it('should return map dimensions if not fullscreen', () => {
    const dimensions = adaptMapDimensions(false, { width: 600, height: 400 });

    expect(dimensions).toEqual({ width: 600, height: 400 });
  });

  it('should return viewport dimensions if not fullscreen but if map is bigger than viewport', () => {
    const dimensions = adaptMapDimensions(false, { width: 1000, height: 1000 });

    expect(dimensions).toEqual({ width: 888, height: 666 });
  });
});
