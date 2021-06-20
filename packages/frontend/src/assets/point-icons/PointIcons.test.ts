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

import { DefaultIcon, getAllIcons, safeGetIcon } from './PointIcons';
import { mountSvg } from '../../core/geo/styles/IconProcessor';
import { PointIconName } from './PointIconName';
import { IconNamesWitness } from './PointIcons.test.data';

describe('PointIcons', () => {
  it('safeGetIcon()', () => {
    const icon = safeGetIcon(PointIconName.IconArrow90DegLeft);
    expect(icon.name).toEqual(PointIconName.IconArrow90DegLeft);
    expect(icon.contentSvg).toMatch(/^<svg.+/);
  });

  it('safeGetIcon() should not fail', () => {
    const icon = safeGetIcon('not an icon' as PointIconName);
    expect(icon.name).toEqual(DefaultIcon.name);
    expect(icon.contentSvg).toEqual(DefaultIcon.contentSvg);
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

  it('Icon change require migration', () => {
    expect(PointIconName).toEqual(IconNamesWitness);
  });
});
