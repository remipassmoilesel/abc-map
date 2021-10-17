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

import { LayoutFormat, LayoutFormats } from '@abc-map/shared';

export interface LabeledLayoutFormat {
  format: LayoutFormat;
  i18nLabel: string;
}

export class LabeledLayoutFormats {
  public static readonly A5_PORTRAIT: LabeledLayoutFormat = {
    i18nLabel: 'A5_portrait',
    format: LayoutFormats.A5_PORTRAIT,
  };

  public static readonly A5_LANDSCAPE: LabeledLayoutFormat = {
    i18nLabel: 'A5_landscape',
    format: LayoutFormats.A5_LANDSCAPE,
  };

  public static readonly A4_PORTRAIT: LabeledLayoutFormat = {
    i18nLabel: 'A4_portrait',
    format: LayoutFormats.A4_PORTRAIT,
  };

  public static readonly A4_LANDSCAPE: LabeledLayoutFormat = {
    i18nLabel: 'A4_landscape',
    format: LayoutFormats.A4_LANDSCAPE,
  };

  public static readonly A3_PORTRAIT: LabeledLayoutFormat = {
    i18nLabel: 'A3_portrait',
    format: LayoutFormats.A3_PORTRAIT,
  };

  public static readonly A3_LANDSCAPE: LabeledLayoutFormat = {
    i18nLabel: 'A3_landscape',
    format: LayoutFormats.A3_LANDSCAPE,
  };

  public static All = [
    LabeledLayoutFormats.A5_PORTRAIT,
    LabeledLayoutFormats.A5_LANDSCAPE,
    LabeledLayoutFormats.A4_PORTRAIT,
    LabeledLayoutFormats.A4_LANDSCAPE,
    LabeledLayoutFormats.A3_PORTRAIT,
    LabeledLayoutFormats.A3_LANDSCAPE,
  ];
}
