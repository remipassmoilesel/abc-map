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

export interface LabeledFillPattern {
  label: string;
  value: FillPatterns;
}

export class LabeledFillPatterns {
  public static readonly Flat: LabeledFillPattern = {
    label: 'Aplat',
    value: FillPatterns.Flat,
  };

  public static readonly Circles: LabeledFillPattern = {
    label: 'Cercles',
    value: FillPatterns.Circles,
  };

  public static readonly Squares: LabeledFillPattern = {
    label: 'Carrés',
    value: FillPatterns.Squares,
  };

  public static readonly HatchingVertical: LabeledFillPattern = {
    label: 'Hachures verticales',
    value: FillPatterns.HatchingVertical,
  };

  public static readonly HatchingHorizontal: LabeledFillPattern = {
    label: 'Hachures horizontales',
    value: FillPatterns.HatchingHorizontal,
  };

  public static readonly HatchingObliqueRight: LabeledFillPattern = {
    label: 'Hachures obliques \\\\',
    value: FillPatterns.HatchingObliqueRight,
  };

  public static readonly HatchingObliqueLeft: LabeledFillPattern = {
    label: 'Hachures obliques //',
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
