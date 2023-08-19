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

import { Map } from 'ol';
import { ToolMode } from '../ToolMode';

const ToolModeProperty = 'abc:map:tool-mode';

export class ToolModeHelper {
  public static is(map: Map, ...modes: ToolMode[]): boolean {
    const current = this.get(map);
    if (!current) {
      return false;
    }

    return modes.includes(current);
  }

  public static get(map: Map): ToolMode | undefined {
    return map.get(ToolModeProperty);
  }

  public static set(map: Map, mode: ToolMode | undefined): void {
    map.set(ToolModeProperty, mode);
  }
}
