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

import { Task } from '../../Task';
import { ProjectService } from '../../../project/ProjectService';
import { AbcLayout } from '@abc-map/shared';
import { getServices } from '../../../Services';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('RemoveLayoutsTask');

export class RemoveLayoutsTask extends Task {
  public static create(layouts: AbcLayout[]) {
    return new RemoveLayoutsTask(getServices().project, layouts);
  }

  private layouts: AbcLayout[];

  constructor(private project: ProjectService, layouts: AbcLayout[]) {
    super();
    this.layouts = layouts.slice();
  }

  public async undo(): Promise<void> {
    this.project.addLayouts(this.layouts);
  }

  public async redo(): Promise<void> {
    this.project.removeLayouts(this.layouts.map((lay) => lay.id));
  }
}
