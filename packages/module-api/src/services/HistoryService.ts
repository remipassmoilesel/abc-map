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

export interface HistoryService {
  register(key: HistoryKey, cs: Changeset): void;
  remove(key: HistoryKey, cs: Changeset): void;
  undo(key: HistoryKey): Promise<void>;
  redo(key: HistoryKey): Promise<void>;
  canUndo(key: HistoryKey): boolean;
  canRedo(key: HistoryKey): boolean;
}

export enum HistoryKey {
  Map = 'Map',
  Export = 'Export',
  SharedViews = 'SharedViews',
}

export interface Changeset {
  execute(): Promise<void>;
  undo(): Promise<void>;
  dispose(): Promise<void>;
}
