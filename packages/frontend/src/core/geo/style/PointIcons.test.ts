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

import { getAllIcons, safeGetIcon } from './PointIcons';
import { mountSvg } from './IconProcessor';
import { PointIcons } from '@abc-map/shared-entities';

describe('PointIcons', () => {
  it('safeGetIcon()', () => {
    const icon = safeGetIcon(PointIcons.Star);
    expect(icon.name).toEqual('star');
    expect(icon.contentSvg).toMatch(/^<\?xml version=/);
  });

  it('safeGetIcon() should not fail', () => {
    const icon = safeGetIcon('not an icon' as PointIcons);
    expect(icon.name).toEqual('square');
    expect(icon.contentSvg).toMatch(/^<\?xml version=/);
  });

  it('getAllIcons() should not return too much icons', () => {
    // Icons are inlined and system is not optimized for a big collection of icons
    // If this test fail, it's refactoring time !
    expect(getAllIcons().length).toBeLessThan(50);
  });

  it('all icons must be valid', () => {
    getAllIcons().forEach((icon) => {
      // Icon must mount as svg
      const { svg } = mountSvg(icon.contentSvg);

      // Icon must have a name
      expect(icon.name).toBeDefined();

      // Icon must have a viewbox attribute
      if (!svg.getAttribute('viewBox')) {
        throw new Error(`You must set viewbox attribute on icon '${icon.name}'`);
      }
    });
  });
});
