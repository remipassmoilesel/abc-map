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

export enum IconCategory {
  Pins = 'Pins',
  Geometries = 'Geometries',
  Objects = 'Objects',
  Weather = 'Weather',
  Arrows = 'Arrows',
  Emojis = 'Emojis',
  Symbols = 'Symbols',
}

export interface LabeledIconCategory {
  label: string;
  value: IconCategory;
}

export class LabeledIconCategories {
  public static Pins: LabeledIconCategory = {
    label: 'Epingles',
    value: IconCategory.Pins,
  };

  public static Geometries: LabeledIconCategory = {
    label: 'Géométries',
    value: IconCategory.Geometries,
  };

  public static Objects: LabeledIconCategory = {
    label: 'Objets',
    value: IconCategory.Objects,
  };

  public static Weather: LabeledIconCategory = {
    label: 'Météo',
    value: IconCategory.Weather,
  };

  public static Arrows: LabeledIconCategory = {
    label: 'Flêches',
    value: IconCategory.Arrows,
  };

  public static Emojis: LabeledIconCategory = {
    label: 'Emojis',
    value: IconCategory.Emojis,
  };

  public static Symbols: LabeledIconCategory = {
    label: 'Symboles',
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
