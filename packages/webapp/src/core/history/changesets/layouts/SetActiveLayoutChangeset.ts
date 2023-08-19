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

import { Changeset } from '../../Changeset';
import { getServices } from '../../../Services';
import { ProjectService } from '../../../project/ProjectService';
import { AbcLayout } from '@abc-map/shared';

export class SetActiveLayoutChangeset extends Changeset {
  public static create(layout: AbcLayout): SetActiveLayoutChangeset {
    const { project } = getServices();
    const previous = project.getActiveLayout();
    return new SetActiveLayoutChangeset(project, previous, layout);
  }

  constructor(private project: ProjectService, private previous: AbcLayout | undefined, private next: AbcLayout) {
    super();
  }

  public async undo(): Promise<void> {
    if (this.previous) {
      this.project.setActiveLayout(this.previous.id);
    }
  }

  public async execute(): Promise<void> {
    this.project.setActiveLayout(this.next.id);
  }
}
