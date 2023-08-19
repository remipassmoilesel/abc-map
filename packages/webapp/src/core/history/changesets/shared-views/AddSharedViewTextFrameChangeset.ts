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
import { AbcSharedView, AbcTextFrame } from '@abc-map/shared';

export class AddSharedViewTextFrameChangeset extends Changeset {
  public static create(view: AbcSharedView, frame: AbcTextFrame): AddSharedViewTextFrameChangeset {
    const { project } = getServices();
    return new AddSharedViewTextFrameChangeset(project, view, frame);
  }

  constructor(private project: ProjectService, private view: AbcSharedView, private frame: AbcTextFrame) {
    super();
  }

  public async undo(): Promise<void> {
    const updated: AbcSharedView = { ...this.view };
    this.project.updateSharedView(updated);
  }

  public async execute(): Promise<void> {
    const updated: AbcSharedView = {
      ...this.view,
      textFrames: this.view.textFrames.concat(this.frame),
    };

    this.project.updateSharedView(updated);
  }
}
