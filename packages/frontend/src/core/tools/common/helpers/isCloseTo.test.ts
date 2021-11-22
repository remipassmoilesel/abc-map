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

import { isCloseTo } from './isCloseTo';

describe('isCloseTo()', () => {
  it('should return true', () => {
    // On exact position
    expect(isCloseTo([1, 1], [1, 1], 2)).toBe(true);
    // Both values near
    expect(isCloseTo([1, 1], [3, 3], 2)).toBe(true);
    // Both values near with negative
    expect(isCloseTo([-1, 1], [1, 3], 2)).toBe(true);
  });

  it('should return false', () => {
    // One value far
    expect(isCloseTo([1, 1], [3, 4], 2)).toBe(false);
    // Both values far
    expect(isCloseTo([1, 1], [4, 4], 2)).toBe(false);
    // Both values far with negative
    expect(isCloseTo([-1, 1], [-2, 4], 2)).toBe(false);
  });
});
