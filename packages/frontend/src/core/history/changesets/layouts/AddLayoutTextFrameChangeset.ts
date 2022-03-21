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
import { AbcLayout, AbcTextFrame } from '@abc-map/shared';

export class AddLayoutTextFrameChangeset extends Changeset {
  public static create(layout: AbcLayout, frame: AbcTextFrame): AddLayoutTextFrameChangeset {
    const { project } = getServices();
    return new AddLayoutTextFrameChangeset(project, layout, frame);
  }

  constructor(private project: ProjectService, private layout: AbcLayout, private frame: AbcTextFrame) {
    super();
  }

  public async undo(): Promise<void> {
    const updated: AbcLayout = { ...this.layout };
    this.project.updateLayout(updated);
  }

  public async apply(): Promise<void> {
    const updated: AbcLayout = {
      ...this.layout,
      textFrames: this.layout.textFrames.concat([this.frame]),
    };

    this.project.updateLayout(updated);
  }
}
