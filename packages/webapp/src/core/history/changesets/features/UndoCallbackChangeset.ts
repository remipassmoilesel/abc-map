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
import { Logger } from '@abc-map/shared';

export const logger = Logger.get('UndoCallbackChangeset');

export class UndoCallbackChangeset extends Changeset {
  constructor(public onUndo: (() => void) | undefined) {
    super();
  }

  public async undo(): Promise<void> {
    if (!this.onUndo) {
      logger.warn('No callback to execute');
      return;
    }

    this.onUndo();
  }

  public async execute(): Promise<void> {
    return;
  }

  public async dispose(): Promise<void> {
    this.onUndo = undefined;
  }
}
