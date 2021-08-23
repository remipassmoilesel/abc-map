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

import { AbcLegend, AbcProjectManifest, AbcProjectMetadata, DEFAULT_PROJECTION, LegendDisplay, ProjectConstants } from '@abc-map/shared';
import uuid from 'uuid-random';
import { DateTime } from 'luxon';

export class ProjectFactory {
  public static newProjectMetadata(): AbcProjectMetadata {
    return {
      id: uuid(),
      version: ProjectConstants.CurrentVersion,
      projection: DEFAULT_PROJECTION,
      name: `Projet du ${DateTime.local().toLocaleString()}`,
      containsCredentials: false,
    };
  }

  public static newProject(): AbcProjectManifest {
    return {
      metadata: ProjectFactory.newProjectMetadata(),
      layers: [],
      layouts: [],
      legend: {
        display: LegendDisplay.Hidden,
        items: [],
        width: 300,
        height: 500,
      },
    };
  }

  public static newLegend(): AbcLegend {
    return {
      display: LegendDisplay.Hidden,
      items: [],
      width: 400,
      height: 300,
    };
  }
}
