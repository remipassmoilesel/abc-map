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
import { ProjectService } from '../../../project/ProjectService';
import { AbcLayout } from '@abc-map/shared';
import { getServices } from '../../../Services';

export class AddLayoutsChangeset extends Changeset {
  public static create(layouts: AbcLayout[]) {
    const { project } = getServices();
    return new AddLayoutsChangeset(project, layouts);
  }

  private layouts: AbcLayout[];

  constructor(private project: ProjectService, layouts: AbcLayout[]) {
    super();
    this.layouts = layouts.slice();
  }

  public async execute(): Promise<void> {
    this.project.addLayouts(this.layouts);

    const layouts = this.project.getLayouts();
    if (layouts.length) {
      this.project.setActiveLayout(layouts[layouts.length - 1].id);
    }
  }

  public async undo(): Promise<void> {
    this.project.removeLayouts(this.layouts.map((lay) => lay.id));

    const layouts = this.project.getLayouts();
    if (layouts.length) {
      this.project.setActiveLayout(layouts[layouts.length - 1].id);
    }
  }
}
