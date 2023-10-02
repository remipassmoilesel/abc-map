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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import range from 'lodash/range';

type State = {
  script: string;
};

type Action = {
  setScript: (script: string) => void;
};

export const usePersistentStore = create<State & Action>()(
  persist(
    (set) => ({
      script: range(0, 15)
        .map(() => '\n')
        .join(''),
      setScript: (script) => set(() => ({ script })),
    }),
    { name: 'ABC_MAP_SCRIPTS_MODULE' }
  )
);
