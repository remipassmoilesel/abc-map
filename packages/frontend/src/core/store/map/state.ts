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

import { FillPatterns } from '@abc-map/shared';
import { DimensionsPx } from '../../utils/DimensionsPx';
import { IconName } from '../../../assets/point-icons/IconName';

export interface MapState {
  /**
   * Current style to apply
   */
  currentStyle: {
    fill: {
      color1: string;
      color2: string;
      pattern: FillPatterns;
    };
    stroke: {
      color: string;
      width: number;
    };
    text: {
      color: string;
      font: string;
      size: number;
      offsetX: number;
      offsetY: number;
      rotation: number;
    };
    point: {
      icon: string;
      size: number;
      color: string;
    };
  };

  /**
   * Largest dimensions of the main map. Used for rendering in previews and export to "guess" a style ratio.
   */
  mainMapDimensions: DimensionsPx;
}

export const mapInitialState: MapState = {
  currentStyle: {
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
      size: 15,
      offsetX: 20,
      offsetY: 20,
      rotation: 0,
    },
    point: {
      icon: IconName.IconGeoAltFill,
      size: 30,
      color: 'rgba(18,90,147,0.9)',
    },
  },
  mainMapDimensions: {
    // FIXME: this is an ugly hack, if user does not display map before rendering a layout we must "guess" values
    width: window.innerWidth,
    height: window.innerHeight * 0.95,
  },
};
