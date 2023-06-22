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

const logger = Logger.get('LayoutHelper.ts');

export class LayoutHelper {
  public static readonly DPI = 25.4;
  public static readonly PRINT_RESOLUTION = 250;

  public static formatToPixel(format: LayoutFormat): DimensionsPx {
    const width = Math.round((format.width * LayoutHelper.PRINT_RESOLUTION) / LayoutHelper.DPI);
    const height = Math.round((format.height * LayoutHelper.PRINT_RESOLUTION) / LayoutHelper.DPI);
    return { width, height };
  }
}
