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
import { AllIcons } from './icons';
import { IconName } from './IconName';
import { IconCategory } from './IconCategory';

export interface PointIcon {
  name: IconName;
  contentSvg: string;
  category: IconCategory;
}

/**
 * Default icon is used when an icon is not found
 */
export const DefaultIcon = AllIcons[0];

/**
 * This function return icon with specified name.
 *
 * This method never fail, if icon was not found, we return the default one.
 *
 * @param name
 */
export function safeGetIcon(name: IconName | string): PointIcon {
  return AllIcons.find((i) => i.name === name) || DefaultIcon;
}

export function getAllIcons(): PointIcon[] {
  return AllIcons;
}
