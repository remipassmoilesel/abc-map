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
import { AbcSharedView } from '@abc-map/shared';
import { getServices } from '../../../Services';

export interface Change {
  before: AbcSharedView;
  after: AbcSharedView;
}

export class UpdateSharedViewsChangeset extends Changeset {
  public static create(changes: Change[]) {
    const { project } = getServices();
    return new UpdateSharedViewsChangeset(project, changes);
  }

  constructor(private project: ProjectService, private changes: Change[]) {
    super();
  }

  public async apply(): Promise<void> {
    this.changes.forEach((change) => this.project.updateSharedView(change.after));
  }

  public async undo(): Promise<void> {
    this.changes.forEach((change) => this.project.updateSharedView(change.before));
  }
}
