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

export enum FillPatterns {
  Flat = 'abc:style:fill:flat',
  Circles = 'abc:style:fill:circles',
  Squares = 'abc:style:fill:squares',
  HatchingVertical = 'abc:style:fill:hatching:vertical',
  HatchingHorizontal = 'abc:style:fill:hatching:horizontal',
  HatchingObliqueRight = 'abc:style:fill:hatching:oblique:right',
  HatchingObliqueLeft = 'abc:style:fill:hatching:oblique:left',
}

export interface FeatureStyle {
  stroke?: StrokeProperties;
  fill?: FillProperties;
  text?: TextProperties;
  point?: PointProperties;
  zIndex?: number;
}

export interface StrokeProperties {
  color?: string;
  width?: number;
}

export interface FillProperties {
  /**
   * Color1 is the main color of fill.
   */
  color1?: string;
  /**
   * Color2 can be used for patterns (e.g: color of circles)
   */
  color2?: string;
  /**
   * Type of pattern, Flat by default
   */
  pattern?: FillPatterns;
}

export interface TextProperties {
  /**
   * Text
   */
  value?: string;
  /**
   * Color of text
   */
  color?: string;
  /**
   * Size of text
   */
  size?: number;
  /**
   * Font of text
   */
  font?: string;
  /**
   * Horizontal text offset in pixels. A positive will shift the text right.
   */
  offsetX?: number;
  /**
   * Vertical text offset in pixels. A positive will shift the text down.
   */
  offsetY?: number;
  /**
   * Vertical text offset in pixels. A positive will shift the text down.
   */
  alignment?: 'left' | 'right' | 'center' | 'end' | 'start' | undefined;
  /**
   * Text rotation in degrees
   */
  rotation?: number;
}

export interface PointProperties {
  icon?: string;
  color?: string;
  size?: number;
}
