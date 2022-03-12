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
import { getServices } from '../../../Services';
import { ProjectService } from '../../../project/ProjectService';
import { AbcSharedView } from '@abc-map/shared';

export class SetActiveSharedViewChangeset extends Changeset {
  public static create(view: AbcSharedView): SetActiveSharedViewChangeset {
    const { project } = getServices();
    const previous = project.getActiveSharedView();
    return new SetActiveSharedViewChangeset(project, previous, view);
  }

  constructor(private project: ProjectService, private previous: AbcSharedView | undefined, private next: AbcSharedView) {
    super();
  }

  public async undo(): Promise<void> {
    if (this.previous) {
      this.project.setActiveSharedView(this.previous.id);
    }
  }

  public async apply(): Promise<void> {
    this.project.setActiveSharedView(this.next.id);
  }
}
