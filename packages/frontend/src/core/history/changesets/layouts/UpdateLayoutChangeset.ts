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
import { AbcLayout } from '@abc-map/shared';
import { getServices } from '../../../Services';

export class UpdateLayoutChangeset extends Changeset {
  public static create(before: AbcLayout, after: AbcLayout) {
    return new UpdateLayoutChangeset(getServices().project, before, after);
  }

  constructor(private project: ProjectService, private before: AbcLayout, private after: AbcLayout) {
    super();
  }

  public async apply(): Promise<void> {
    this.project.updateLayout(this.after);
  }

  public async undo(): Promise<void> {
    this.project.updateLayout(this.before);
  }
}
