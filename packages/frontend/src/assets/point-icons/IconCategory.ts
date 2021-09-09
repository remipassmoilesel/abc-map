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
