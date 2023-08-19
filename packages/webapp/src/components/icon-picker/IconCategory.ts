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

import { IconCategory } from '../../assets/point-icons/IconCategory';

export interface LabeledIconCategory {
  i18nLabel: string;
  value: IconCategory;
}

export class LabeledIconCategories {
  public static Pins: LabeledIconCategory = {
    i18nLabel: 'Pins',
    value: IconCategory.Pins,
  };

  public static Geometries: LabeledIconCategory = {
    i18nLabel: 'Geometries',
    value: IconCategory.Geometries,
  };

  public static Objects: LabeledIconCategory = {
    i18nLabel: 'Objects',
    value: IconCategory.Objects,
  };

  public static Weather: LabeledIconCategory = {
    i18nLabel: 'Weather',
    value: IconCategory.Weather,
  };

  public static Arrows: LabeledIconCategory = {
    i18nLabel: 'Arrows',
    value: IconCategory.Arrows,
  };

  public static Emojis: LabeledIconCategory = {
    i18nLabel: 'Emojis',
    value: IconCategory.Emojis,
  };

  public static Symbols: LabeledIconCategory = {
    i18nLabel: 'Symbols',
    value: IconCategory.Symbols,
  };

  /**
   * All labeled categories. They are displayed in icon picker in order.
   */
  public static All: LabeledIconCategory[] = [
    LabeledIconCategories.Pins,
    LabeledIconCategories.Geometries,
    LabeledIconCategories.Symbols,
    LabeledIconCategories.Arrows,
    LabeledIconCategories.Emojis,
    LabeledIconCategories.Weather,
    LabeledIconCategories.Objects,
  ];
}
