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

import { Changeset } from '../../Changeset';
import { ProjectService } from '../../../project/ProjectService';
import { AbcNorth, AbcSharedView } from '@abc-map/shared';
import { getServices } from '../../../Services';

export class UpdateSharedViewNorthChangeset extends Changeset {
  public static create(layout: AbcSharedView, before: AbcNorth, after: AbcNorth) {
    const { project } = getServices();
    return new UpdateSharedViewNorthChangeset(project, layout, before, after);
  }

  constructor(private project: ProjectService, private view: AbcSharedView, private before: AbcNorth, private after: AbcNorth) {
    super();
  }

  public async apply(): Promise<void> {
    this.project.updateSharedView({ ...this.view, north: { ...this.after } });
  }

  public async undo(): Promise<void> {
    this.project.updateSharedView({ ...this.view, north: { ...this.before } });
  }
}
