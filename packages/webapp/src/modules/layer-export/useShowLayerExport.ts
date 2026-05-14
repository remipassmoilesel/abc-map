/**
 * Copyright © 2026 Rémi Pace.
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

import { Routes } from '../../routes';
import { ModuleId } from '@abc-map/shared';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useServices } from '../../core/useServices.ts';

export type ReturnType = (layerId?: string) => void;

export function useShowLayerExport(): ReturnType {
  const navigate = useNavigate();
  const { toasts } = useServices();

  return useMemo(
    () => (layerId?: string) => {
      navigate({
        pathname: Routes.module().withParams({ moduleId: ModuleId.LayerExport }),
        search: layerId ? createSearchParams({ layerId }).toString() : undefined,
      })?.catch((err) => toasts.genericError(err));
    },
    [navigate, toasts],
  );
}
