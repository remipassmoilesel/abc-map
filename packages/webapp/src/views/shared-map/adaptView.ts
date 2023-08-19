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

import { AbcView } from '@abc-map/shared';
import { DimensionsPx } from '../../core/utils/DimensionsPx';
import { adaptMapDimensions } from '../../core/project/adaptMapDimensions';
import { Views } from '../../core/geo/Views';

/**
 * This function adapt view resolution depending on screen size.
 *
 * The main goal is to show what users want to show even if visitor screen is smaller than original map.
 *
 * @param original
 * @param fullscreen
 * @param mapDimensions
 */
export function adaptView(original: AbcView, fullscreen: boolean, mapDimensions: DimensionsPx): AbcView {
  const { width: actualWidth, height: actualHeight } = adaptMapDimensions(fullscreen, mapDimensions);

  let view = { ...original };
  if (actualWidth < mapDimensions.width || actualHeight < mapDimensions.height) {
    const actualDiag = Math.sqrt(actualWidth ** 2 + actualHeight ** 2);
    const originalDiag = Math.sqrt(mapDimensions.width ** 2 + mapDimensions.height ** 2);

    view = Views.normalize({
      ...view,
      resolution: view.resolution / (actualDiag / originalDiag),
    });
  }

  return view;
}
