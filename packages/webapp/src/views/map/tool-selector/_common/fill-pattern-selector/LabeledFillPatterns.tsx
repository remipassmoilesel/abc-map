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

export interface LabeledFillPattern {
  i18nLabel: string;
  value: FillPatterns;
}

export class LabeledFillPatterns {
  public static readonly Flat: LabeledFillPattern = {
    i18nLabel: 'Flat',
    value: FillPatterns.Flat,
  };

  public static readonly Circles: LabeledFillPattern = {
    i18nLabel: 'Circles',
    value: FillPatterns.Circles,
  };

  public static readonly Squares: LabeledFillPattern = {
    i18nLabel: 'Squares',
    value: FillPatterns.Squares,
  };

  public static readonly HatchingVertical: LabeledFillPattern = {
    i18nLabel: 'Vertical_hatching',
    value: FillPatterns.HatchingVertical,
  };

  public static readonly HatchingHorizontal: LabeledFillPattern = {
    i18nLabel: 'Horizontal_hatching',
    value: FillPatterns.HatchingHorizontal,
  };

  public static readonly HatchingObliqueRight: LabeledFillPattern = {
    i18nLabel: 'Oblique_hatching_right',
    value: FillPatterns.HatchingObliqueRight,
  };

  public static readonly HatchingObliqueLeft: LabeledFillPattern = {
    i18nLabel: 'Oblique_hatching_left',
    value: FillPatterns.HatchingObliqueLeft,
  };

  public static readonly All: LabeledFillPattern[] = [
    LabeledFillPatterns.Flat,
    LabeledFillPatterns.Circles,
    LabeledFillPatterns.Squares,
    LabeledFillPatterns.HatchingVertical,
    LabeledFillPatterns.HatchingHorizontal,
    LabeledFillPatterns.HatchingObliqueRight,
    LabeledFillPatterns.HatchingObliqueLeft,
  ];
}
