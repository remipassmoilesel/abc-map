/**
 * Copyright © 2022 Rémi Pace.
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

import { TopBar } from './TopBar';

export type ModuleId =
  | 'artefact-generator'
  | 'color-gradients'
  | 'count-points-in-polygon'
  | 'data-store'
  | 'data-table'
  | 'different-symbols'
  | 'project-management'
  | 'proportional-symbols'
  | 'scripts'
  | 'shared-map-settings'
  | 'static-export';

export class Modules {
  public static open(moduleId: ModuleId) {
    return (
      TopBar.moduleIndex()
        // Search for module id
        .get('[data-cy=module-search]')
        .type(moduleId)
        // Open module
        .get('[data-cy=search-results] [data-cy=open-module]')
        .eq(0)
        .click()
    );
  }
}
