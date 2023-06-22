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

interface RemoveViewOperation {
  view: AbcSharedView;
  index: number;
}

export class RemoveSharedViewsChangeset extends Changeset {
  public static create(toRemove: AbcSharedView[]) {
    const { project } = getServices();
    const views = project.getSharedViews();
    const operations: RemoveViewOperation[] = toRemove.map((view) => ({ view, index: views.findIndex((v) => v.id === view.id) }));
    return new RemoveSharedViewsChangeset(project, operations);
  }

  private operations: RemoveViewOperation[];

  constructor(private project: ProjectService, operations: RemoveViewOperation[]) {
    super();
    if (!operations.length) {
      throw new Error('Operation list cannot be empty');
    }

    this.operations = operations;
  }

  public async execute(): Promise<void> {
    this.project.removeSharedViews(this.operations.map((op) => op.view));

    const views = this.project.getSharedViews();
    if (views.length) {
      this.project.setActiveSharedView(views[views.length - 1].id);
    }
  }

  public async undo(): Promise<void> {
    this.operations.forEach((op) => this.project.addSharedView(op.view, op.index));

    const last = this.operations[this.operations.length - 1].view;
    this.project.setActiveSharedView(last.id);
  }
}
