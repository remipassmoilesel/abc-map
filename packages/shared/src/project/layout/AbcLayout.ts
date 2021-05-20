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

import { AbcProjection } from '../AbcProjection';

export interface AbcLayout {
  id: string;
  name: string;
  format: LayoutFormat;
  view: AbcLayoutView;
}

export interface LayoutFormat {
  name: string;
  /**
   * In millimeters
   */
  width: number;
  /**
   * In millimeters
   */
  height: number;
  orientation: 'portrait' | 'landscape';
}

export class LayoutFormats {
  public static readonly A5_PORTRAIT: LayoutFormat = {
    name: 'A5 Portrait',
    width: 148,
    height: 210,
    orientation: 'portrait',
  };

  public static readonly A5_LANDSCAPE: LayoutFormat = {
    name: 'A5 Paysage',
    width: 210,
    height: 148,
    orientation: 'landscape',
  };

  public static readonly A4_PORTRAIT: LayoutFormat = {
    name: 'A4 Portrait',
    width: 210,
    height: 297,
    orientation: 'portrait',
  };

  public static readonly A4_LANDSCAPE: LayoutFormat = {
    name: 'A4 Paysage',
    width: 297,
    height: 210,
    orientation: 'landscape',
  };

  public static readonly A3_PORTRAIT: LayoutFormat = {
    name: 'A3 Portrait',
    width: 297,
    height: 420,
    orientation: 'portrait',
  };

  public static readonly A3_LANDSCAPE: LayoutFormat = {
    name: 'A3 Paysage',
    width: 420,
    height: 297,
    orientation: 'landscape',
  };

  public static ALL: LayoutFormat[] = [
    LayoutFormats.A5_PORTRAIT,
    LayoutFormats.A5_LANDSCAPE,
    LayoutFormats.A4_PORTRAIT,
    LayoutFormats.A4_LANDSCAPE,
    LayoutFormats.A3_PORTRAIT,
    LayoutFormats.A3_LANDSCAPE,
  ];
}

export interface AbcLayoutView {
  center: number[];
  resolution: number;
  projection: AbcProjection;
}
