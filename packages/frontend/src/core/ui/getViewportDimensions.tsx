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

import { DimensionsPx } from '../utils/DimensionsPx';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('getViewportDimensions.tsx');

let viewport: HTMLDivElement | null = null;

export function getViewportDimensions(): DimensionsPx | undefined {
  if (!viewport || !viewport.isConnected) {
    viewport = document.querySelector<HTMLDivElement>('.abc-app-viewport');
  }

  if (!viewport) {
    logger.error('Viewport not found');
    return;
  }

  return { width: viewport.clientWidth, height: viewport.clientHeight };
}
