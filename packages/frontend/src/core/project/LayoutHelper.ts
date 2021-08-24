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

import { LayoutFormat, Logger } from '@abc-map/shared';
import { DimensionsPx } from '../utils/DimensionsPx';
import { mainStore } from '../store/store';
import { toPrecision } from '../utils/numbers';

const logger = Logger.get('LayoutHelper.ts');

export class LayoutHelper {
  public static readonly DPI = 25.4;
  public static readonly PRINT_RESOLUTION = 200;

  public static formatToPixel(format: LayoutFormat): DimensionsPx {
    const width = Math.round((format.width * LayoutHelper.PRINT_RESOLUTION) / LayoutHelper.DPI);
    const height = Math.round((format.height * LayoutHelper.PRINT_RESOLUTION) / LayoutHelper.DPI);
    return { width, height };
  }

  /**
   * Here we compute a style ratio for previews and exports.
   *
   * We use diagonals of main map and provided dimension.
   *
   * @param mapWidth
   * @param mapHeight
   */
  public static styleRatio(mapWidth: number, mapHeight: number): number {
    const { width, height } = mainStore.getState().map.mainMapDimensions;
    if (!width || !height) {
      throw new Error('Main map dimensions not set');
    }

    const targetDiag = Math.sqrt(mapWidth ** 2 + mapHeight ** 2);
    const mainMapDiag = Math.sqrt(width ** 2 + height ** 2);

    return toPrecision(targetDiag / mainMapDiag, 2);
  }
}
