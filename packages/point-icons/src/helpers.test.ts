/**
 * Copyright © 2026 Rémi Pace.
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

import { getSafeIconName } from './helpers.js';
import { IconName } from './IconName.js';
import { describe, expect, it } from 'vitest';

describe('helpers', () => {
  it('getSafeIconName()', () => {
    expect(getSafeIconName('not an icon')).toEqual({ category: 'Geometries', name: 'twbs/0_circle-fill.svg' });
    expect(getSafeIconName(IconName.IconArrowDown)).toEqual({ category: 'Arrows', name: 'twbs/arrow-down.svg' });
  });
});
