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
  i18nLabel: string;
}

export class LabeledLegendDisplays {
  public static readonly Hidden: LabeledLegendDisplay = {
    value: LegendDisplay.Hidden,
    i18nLabel: 'No_legend',
  };

  public static readonly UpperLeftCorner: LabeledLegendDisplay = {
    value: LegendDisplay.UpperLeftCorner,
    i18nLabel: 'Top_left_corner',
  };

  public static readonly UpperRightCorner: LabeledLegendDisplay = {
    value: LegendDisplay.UpperRightCorner,
    i18nLabel: 'Top_right_corner',
  };

  public static readonly BottomRightCorner: LabeledLegendDisplay = {
    value: LegendDisplay.BottomRightCorner,
    i18nLabel: 'Bottom_right_corner',
  };

  public static readonly BottomLeftCorner: LabeledLegendDisplay = {
    value: LegendDisplay.BottomLeftCorner,
    i18nLabel: 'Bottom_left_corner',
  };

  public static readonly All = [
    LabeledLegendDisplays.Hidden,
    LabeledLegendDisplays.UpperLeftCorner,
    LabeledLegendDisplays.UpperRightCorner,
    LabeledLegendDisplays.BottomRightCorner,
    LabeledLegendDisplays.BottomLeftCorner,
  ];
}
