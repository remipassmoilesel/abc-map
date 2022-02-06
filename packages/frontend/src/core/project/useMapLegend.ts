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

import { AbcLegend } from '@abc-map/shared';
import { useAppSelector } from '../store/hooks';

/**
 * This hook returns legend with specified id or undefined if not found.
 * @param id
 */
export const useMapLegend = (id: string | undefined): AbcLegend | undefined => {
  const { layouts, sharedViews } = useAppSelector((st) => st.project);
  if (!id) {
    return;
  }

  return layouts.list.find((lay) => lay.legend.id === id)?.legend || sharedViews.list.find((view) => view.legend.id === id)?.legend;
};

/**
 * This hook returns legend with specified parent id (layout id, shared view id, ...) or undefined if not found.
 * @param parendId
 */
export const useMapLegendByParentId = (parendId: string | undefined): AbcLegend | undefined => {
  const { layouts, sharedViews } = useAppSelector((st) => st.project);
  if (!parendId) {
    return;
  }

  return layouts.list.find((lay) => lay.id === parendId)?.legend || sharedViews.list.find((view) => view.id === parendId)?.legend;
};
