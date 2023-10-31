/**
 * Copyright © 2023 Rémi Pace.
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

import { IconProcessor } from '../../core/geo/styles/IconProcessor';
import { PointIcon } from '../../assets/point-icons/PointIcon';
import { IconCategory } from '../../assets/point-icons/IconCategory';
import { getAllIcons } from '../../assets/point-icons/helpers';

export interface IconPreview {
  icon: PointIcon;
  /**
   * Base 64 string of icon
   */
  preview: string;
}

let previews: Map<IconCategory, IconPreview[]> | undefined;

export function getPreviews() {
  if (!previews) {
    // We prepare previews
    const iconList = getAllIcons().map((i) => ({ icon: i, preview: IconProcessor.get().prepareCached(i, 50, '#0077b6') }));

    // We sort them by category
    previews = new Map<IconCategory, IconPreview[]>();
    for (const preview of iconList) {
      const category = previews.get(preview.icon.category);
      if (!category) {
        previews.set(preview.icon.category, [preview]);
      } else {
        category.push(preview);
      }
    }
  }

  return previews;
}
