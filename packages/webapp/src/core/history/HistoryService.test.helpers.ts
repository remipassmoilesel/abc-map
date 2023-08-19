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

import { HistoryKey } from './HistoryKey';
import { History } from './HistoryService';
import { Changeset } from './Changeset';
import sinon from 'sinon';

export class FakeChangeset extends Changeset {
  constructor(public id: number) {
    super();
    this.dispose.resolves();
  }

  public execute(): Promise<void> {
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    return Promise.resolve();
  }

  public dispose = sinon.stub();
}

export function getUndoStackIds(history: History, key: HistoryKey): number[] {
  return history[key]?.undo.map((cs) => (cs as FakeChangeset).id) as number[];
}

export function getRedoStackIds(history: History, key: HistoryKey): number[] {
  return history[key]?.redo.map((cs) => (cs as FakeChangeset).id) as number[];
}
