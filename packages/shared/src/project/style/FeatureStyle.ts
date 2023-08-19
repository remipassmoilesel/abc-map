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
import { FillPatterns } from './StyleProperties';

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

// This style is mainly used for imported data
export const DefaultStyle = {
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
    icon: 'twbs/0_circle-fill.inline.svg',
    size: 10,
  },
};

export function cloneFeatureStyle(fs: FeatureStyle): FeatureStyle {
  return {
    fill: { ...fs.fill },
    stroke: { ...fs.stroke },
    text: { ...fs.text },
    point: { ...fs.point },
    zIndex: fs.zIndex,
  };
}
