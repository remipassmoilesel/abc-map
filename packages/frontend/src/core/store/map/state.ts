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

import { FeatureStyle } from '../../geo/style/FeatureStyle';
import { MapTool } from '@abc-map/frontend-commons';
import { PointIcons } from '@abc-map/shared-entities';

export interface MapState {
  /**
   * Current tool selected
   */
  tool: MapTool;

  currentStyle: FeatureStyle;
}

export const mapInitialState: MapState = {
  tool: MapTool.None,
  currentStyle: {
    fill: {
      color1: '#FFFFFF',
      color2: '#005cc1',
    },
    stroke: {
      color: '#3F37C9',
      width: 5,
    },
    text: {
      color: '#3F37C9',
      font: 'sans-serif',
      size: 30,
    },
    point: {
      icon: PointIcons.Circle,
      size: 15,
      color: '#3F37C9',
    },
  },
};
