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

import { LegendDisplay } from '@abc-map/shared';

export interface LabeledLegendDisplay {
  value: LegendDisplay;
  label: string;
}

export class LabeledLegendDisplays {
  public static readonly Hidden: LabeledLegendDisplay = {
    value: LegendDisplay.Hidden,
    label: 'Pas de légende',
  };

  public static readonly UpperLeftCorner: LabeledLegendDisplay = {
    value: LegendDisplay.UpperLeftCorner,
    label: 'En haut à gauche',
  };

  public static readonly UpperRightCorner: LabeledLegendDisplay = {
    value: LegendDisplay.UpperRightCorner,
    label: 'En haut à droite',
  };

  public static readonly BottomRightCorner: LabeledLegendDisplay = {
    value: LegendDisplay.BottomRightCorner,
    label: 'En bas à droite',
  };

  public static readonly BottomLeftCorner: LabeledLegendDisplay = {
    value: LegendDisplay.BottomLeftCorner,
    label: 'En bas à gauche',
  };

  public static readonly All = [
    LabeledLegendDisplays.Hidden,
    LabeledLegendDisplays.UpperLeftCorner,
    LabeledLegendDisplays.UpperRightCorner,
    LabeledLegendDisplays.BottomRightCorner,
    LabeledLegendDisplays.BottomLeftCorner,
  ];
}
