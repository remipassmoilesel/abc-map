/**
 * Copyright © 2022 Rémi Pace.
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

import { PaginationState, SortingState } from '@tanstack/react-table';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// You should increase version each time a breaking change is introduced
const StateVersion = 2;

export interface TableSettings {
  sorting: SortingState | undefined;
  pagination: PaginationState | undefined;
}

type State = {
  sortingByLayerId: {
    [k: string]: SortingState | undefined;
  };
  paginationByLayerId: {
    [k: string]: PaginationState | undefined;
  };
};

type Action = {
  setSettings: (layerId: string, settings: TableSettings) => void;
};

export const usePersistentStore = create<State & Action>()(
  persist(
    (set) => ({
      sortingByLayerId: {},
      paginationByLayerId: {},
      setSettings: (layerId: string, settings: TableSettings) =>
        set((state) => ({
          sortingByLayerId: { ...state.sortingByLayerId, [layerId]: settings.sorting },
          paginationByLayerId: { ...state.paginationByLayerId, [layerId]: settings.pagination },
        })),
    }),
    { name: 'ABC_MAP_DATA_TABLE_MODULE', version: StateVersion }
  )
);
