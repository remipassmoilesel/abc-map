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

import { AbcLayout, AbcProjectMetadata } from '@abc-map/shared';
import { ProjectFactory } from '../../project/ProjectFactory';
import { AbcView } from '@abc-map/shared/build/project/AbcView';
import { Views } from '../../geo/Views';
import { AbcSharedView } from '@abc-map/shared';
import { DimensionsPx } from '../../utils/DimensionsPx';

/**
 * This state must not contain heavy data (like layer data), because it is persisted in local storage.
 */
export interface ProjectState {
  /**
   * Metadata of current project.
   */
  metadata: AbcProjectMetadata;

  /**
   * View used on main map, and persisted with project
   */
  mainView: AbcView;

  layouts: {
    /**
     * Layouts of current project
     */
    list: AbcLayout[];

    /**
     * Current layout displayed
     */
    activeId?: string;
  };

  sharedViews: {
    // If true, shared map is fullscreen
    fullscreen: boolean;
    // If not fullscreen, these dimensions are used
    mapDimensions: DimensionsPx;
    /**
     * Shared views of current project
     */
    list: AbcSharedView[];

    /**
     * Current view displayed
     */
    activeId?: string;
  };
}

// This state will be replaced by a new projet on bootstrap
export const projectInitialState: ProjectState = {
  metadata: ProjectFactory.newProjectMetadata(),
  mainView: Views.defaultView(),
  layouts: {
    list: [],
  },
  sharedViews: {
    fullscreen: false,
    mapDimensions: { width: 0, height: 0 },
    list: [],
  },
};
