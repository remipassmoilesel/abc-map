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

const logger = Logger.get('RemoveLayoutsChangeset');

interface RemoveLayoutOperation {
  layout: AbcLayout;
  index: number;
}

export class RemoveLayoutsChangeset extends Changeset {
  public static create(toRemove: AbcLayout[]) {
    const { project } = getServices();
    const layouts = project.getLayouts();
    const operations: RemoveLayoutOperation[] = toRemove.map((lay) => ({ layout: lay, index: layouts.findIndex((l) => l.id === lay.id) }));
    return new RemoveLayoutsChangeset(project, operations);
  }

  private operations: RemoveLayoutOperation[];

  constructor(private project: ProjectService, operations: RemoveLayoutOperation[]) {
    super();
    if (!operations.length) {
      throw new Error('List of operations cannot be empty');
    }
    this.operations = operations;
  }

  public async execute(): Promise<void> {
    this.project.removeLayouts(this.operations.map((op) => op.layout.id));

    const layouts = this.project.getLayouts();
    if (layouts.length) {
      this.project.setActiveLayout(layouts[layouts.length - 1].id);
    }
  }

  public async undo(): Promise<void> {
    this.operations.forEach((op) => this.project.addLayout(op.layout, op.index));

    const last = this.operations[this.operations.length - 1].layout;
    this.project.setActiveLayout(last.id);
  }
}
