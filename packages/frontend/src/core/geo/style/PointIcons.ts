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

import squareIcon from '../../../assets/point-icons/square.inline.svg';
import circleIcon from '../../../assets/point-icons/circle.inline.svg';
import starIcon from '../../../assets/point-icons/star.inline.svg';
import { PointIcons } from '@abc-map/shared-entities';

export interface PointIcon {
  name: PointIcons;
  contentSvg: string;
}

const AllIcons: PointIcon[] = [
  {
    name: PointIcons.Square,
    contentSvg: squareIcon,
  },
  {
    name: PointIcons.Circle,
    contentSvg: circleIcon,
  },
  {
    name: PointIcons.Star,
    contentSvg: starIcon,
  },
];

export const DefaultIcon = AllIcons[0];

/**
 * This function return icon with specified name.
 *
 * This method never fail, if icon was not found, we return the default one.
 *
 * @param name
 */
export function safeGetIcon(name: PointIcons | string): PointIcon {
  return AllIcons.find((i) => i.name === name) || DefaultIcon;
}

export function getAllIcons(): PointIcon[] {
  return AllIcons;
}
