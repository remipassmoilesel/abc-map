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

import { FillPatterns } from '@abc-map/shared';

export const DefaultDrawingStyle = {
  fill: {
    color1: 'rgba(18,90,147,0.30)',
    color2: 'rgba(255,255,255,0.60)',
    pattern: FillPatterns.HatchingObliqueRight,
  },
  stroke: {
    color: 'rgba(18,90,147,0.60)',
    width: 3,
  },
  text: {
    color: 'rgba(18,90,147,1)',
    font: 'AbcCantarell',
    size: 30,
    offsetX: 15,
    offsetY: 15,
    rotation: 0,
  },
  point: {
    icon: 'twbs/geo-alt-fill.inline.svg',
    size: 30,
    color: 'rgba(18,90,147,0.9)',
  },
};
