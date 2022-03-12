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
import { Logger } from '@abc-map/shared';

const logger = Logger.get('SetLayoutIndexChangeset');

export class SetLayoutPositionChangeset extends Changeset {
  public static create(layout: AbcLayout, oldIndex: number, newIndex: number) {
    const { project } = getServices();
    return new SetLayoutPositionChangeset(project, layout, oldIndex, newIndex);
  }

  constructor(private project: ProjectService, private layout: AbcLayout, private previousPosition: number, private nextPosition: number) {
    super();
  }

  public async apply(): Promise<void> {
    this.project.setLayoutIndex(this.layout, this.nextPosition);
  }

  public async undo(): Promise<void> {
    this.project.setLayoutIndex(this.layout, this.previousPosition);
  }
}
