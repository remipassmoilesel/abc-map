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

import { Changeset } from '../Changeset';
import { getServices } from '../../Services';
import { ProjectService } from '../../project/ProjectService';
import { AbcTextFrame } from '@abc-map/shared';

export class UpdateTextFrameChangeset extends Changeset {
  public static create(before: AbcTextFrame, after: AbcTextFrame): UpdateTextFrameChangeset {
    const { project } = getServices();
    return new UpdateTextFrameChangeset(project, before, after);
  }

  constructor(private project: ProjectService, private before: AbcTextFrame, private after: AbcTextFrame) {
    super();
  }

  public async undo(): Promise<void> {
    this.project.updateTextFrame(this.before);
  }

  public async execute(): Promise<void> {
    this.project.updateTextFrame(this.after);
  }
}
